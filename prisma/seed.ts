import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Clear existing database to prevent duplicates
  // Note: Order matters to avoid foreign key constraint violations
  await prisma.answer.deleteMany();
  await prisma.inlineComment.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.question.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared existing database.");

  // Create Users
  const admin = await prisma.user.create({
    data: {
      name: "Mr. Olusegun",
      email: "admin@caspaa.test",
      role: "ADMIN",
      password: "password123",
    },
  });

  const teacher = await prisma.user.create({
    data: {
      name: "Mr. Okafor",
      email: "teacher@caspaa.test",
      role: "TEACHER",
      password: "password123",
    },
  });

  const student1 = await prisma.user.create({
    data: {
      name: "Jeremiah Balogun",
      email: "jeremiah@caspaa.test",
      role: "STUDENT",
      password: "password123",
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: "Chiamaka Okafor",
      email: "chiamaka@caspaa.test",
      role: "STUDENT",
      password: "password123",
    },
  });

  console.log("Successfully created 4 users:");
  console.table([
    { name: admin.name, email: admin.email, role: admin.role },
    { name: teacher.name, email: teacher.email, role: teacher.role },
    { name: student1.name, email: student1.email, role: student1.role },
    { name: student2.name, email: student2.email, role: student2.role },
  ]);

  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
