import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    await prisma.$connect()
    console.log('Database connection successful!')
    
    const users = await prisma.user.findMany()
    console.log('Query successful! Users count:', users.length)
    
    await prisma.$disconnect()
    process.exit(0)
  } catch (error) {
    console.error('Database connection failed:', error)
    process.exit(1)
  }
}

testConnection()
