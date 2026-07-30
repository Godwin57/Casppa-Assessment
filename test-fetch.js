const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const teacher = await prisma.user.findUnique({ where: { email: 'teacher@caspaa.test' } });
  const assignments = await prisma.assignment.findMany({ where: { teacherId: teacher.id } });
  if (assignments.length === 0) {
    console.log("No assignments found for teacher");
    return;
  }
  
  const assignmentId = assignments[0].id;
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      submissions: {
        include: {
          student: { select: { name: true } }
        },
        orderBy: { status: 'asc' }
      }
    }
  });
  console.log(JSON.stringify(assignment, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
