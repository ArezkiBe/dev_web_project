import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient, User } from '@prisma/client';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

interface AuthenticatedRequest extends Request {
  user?: User;
}

//middleware to get user from microsoftId
const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: Bearer token required' });
        return;
    }

    const microsoftId = authHeader.split(' ')[1];
    if (!microsoftId) {
        res.status(401).json({ error: 'Unauthorized: Microsoft ID missing' });
        return;
    }

    try {
        let user = await prisma.user.findUnique({
            where: { microsoftId },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    microsoftId,
                },
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Internal server error during authentication' });
    }
};

app.use(authenticate);


app.get('/parcours', async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const parcours = await prisma.parcours.findMany({
        where: { userId: req.user.id },
        include: { modules: true },
    });
    res.json(parcours);
});

app.post('/parcours', async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { titre, description, objectifs } = req.body;
    const newParcours = await prisma.parcours.create({
        data: {
            titre,
            description,
            objectifs,
            userId: req.user.id,
        },
    });
    res.status(201).json(newParcours);
});

app.get('/parcours/:id', async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id } = req.params;
    const parcours = await prisma.parcours.findFirst({
        where: { id: id, userId: req.user.id },
        include: { modules: true },
    });
    if (!parcours) {
        return res.status(404).json({ error: 'Parcours not found' });
    }
    res.json(parcours);
});

app.put('/parcours/:id', async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id } = req.params;
    const { titre, description, objectifs } = req.body;
    try {
        const updatedParcours = await prisma.parcours.updateMany({
            where: { id: id, userId: req.user.id },
            data: {
                titre,
                description,
                objectifs,
            },
        });

        if (updatedParcours.count === 0) {
             return res.status(404).json({ error: 'Parcours not found or user not authorized' });
        }
        
        const parcours = await prisma.parcours.findUnique({where: {id}});
        res.json(parcours);

    } catch (error) {
        res.status(500).json({ error: 'Failed to update parcours' });
    }
});

app.delete('/parcours/:id', async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id } = req.params;
    try {
        const result = await prisma.parcours.deleteMany({
            where: { id: id, userId: req.user.id },
        });

        if (result.count === 0) {
            return res.status(404).json({ error: 'Parcours not found or user not authorized' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete parcours' });
    }
});


// Module Routes
app.post('/parcours/:parcoursId/modules', async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { parcoursId } = req.params;
    const { titre, lienExterne, dateDebut, dateCible, statut } = req.body;

    const parcours = await prisma.parcours.findFirst({
        where: { id: parcoursId, userId: req.user.id }
    });

    if(!parcours){
        return res.status(404).json({ error: 'Parcours not found or user not authorized' });
    }

    const newModule = await prisma.module.create({
        data: {
            titre,
            lienExterne,
            dateDebut: dateDebut ? new Date(dateDebut) : null,
            dateCible: dateCible ? new Date(dateCible) : null,
            statut,
            parcoursId: parcoursId,
        },
    });
    res.status(201).json(newModule);
});

app.put('/modules/:id', async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id } = req.params;
    const { titre, lienExterne, dateDebut, dateCible, statut } = req.body;

    try {
         const moduleToUpdate = await prisma.module.findUnique({
            where: {id},
            select: { parcours: { select: { userId: true}}}
        });

        if (!moduleToUpdate || moduleToUpdate.parcours.userId !== req.user.id) {
            return res.status(404).json({ error: 'Module not found or user not authorized' });
        }

        const updatedModule = await prisma.module.update({
            where: { id },
            data: {
                titre,
                lienExterne,
                dateDebut: dateDebut ? new Date(dateDebut) : null,
                dateCible: dateCible ? new Date(dateCible) : null,
                statut,
            },
        });
        res.json(updatedModule);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update module' });
    }
});

app.delete('/modules/:id', async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id } = req.params;

    try {
        const moduleToDelete = await prisma.module.findUnique({
            where: {id},
            select: { parcours: { select: { userId: true}}}
        });

        if (!moduleToDelete || moduleToDelete.parcours.userId !== req.user.id) {
            return res.status(404).json({ error: 'Module not found or user not authorized' });
        }

        await prisma.module.delete({
            where: { id },
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete module' });
    }
});

// User info route
app.get('/user/me', (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json(req.user);
});

app.put('/user/me', async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { nom, email } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                nom,
                email
            }
        });
        res.json(updatedUser);
    } catch (error) {
        // P5002: Unique constraint failed
        if ((error as any).code === 'P2002' && (error as any).meta?.target?.includes('email')) {
             return res.status(409).json({ error: 'Email already in use.'})
        }
        res.status(500).json({ error: 'Failed to update user' });
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
