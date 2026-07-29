import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean up existing users to prevent duplicates if you run it multiple times
  await prisma.user.deleteMany();

  // 1. Create a Proprietor
  const proprietor = await prisma.user.create({
    data: {
      email: "proprietor@caspaa.com",
      name: "Mrs. Balogun",
      password: "password123", // In a real app, this MUST be hashed!
      role: Role.ADMIN,
    },
  });

  // 2. Create a Teacher
  const teacher = await prisma.user.create({
    data: {
      email: "teacher@caspaa.com",
      name: "Mr. Adamu",
      password: "password123",
      role: Role.TEACHER,
    },
  });

  // 3. Create a Student
  const student = await prisma.user.create({
    data: {
      email: "student@caspaa.com",
      name: "Chiamaka Okafor",
      password: "password123",
      role: Role.STUDENT,
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log({ proprietor, teacher, student });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
