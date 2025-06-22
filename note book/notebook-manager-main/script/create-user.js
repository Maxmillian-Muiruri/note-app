const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createUser() {
  try {
    const user = await prisma.user.create({
      data: {
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword123', // In real app, this should be hashed
      },
    });
    console.log('User created:', user);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('User with id 1 already exists');
    } else {
      console.error('Error creating user:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createUser(); 