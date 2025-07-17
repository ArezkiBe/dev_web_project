import { PrismaClient } from '@prisma/client';
// Create a singleton Prisma client instance
class PrismaClientSingleton {
    static getInstance() {
        if (!PrismaClientSingleton.instance) {
            PrismaClientSingleton.instance = new PrismaClient({
                datasources: {
                    db: {
                        url: process.env.DATABASE_URL,
                    },
                },
                // Add connection options that work better with PgBouncer
                log: ['error', 'warn'],
            });
        }
        return PrismaClientSingleton.instance;
    }
}
export const prisma = PrismaClientSingleton.getInstance();
// Handle graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
