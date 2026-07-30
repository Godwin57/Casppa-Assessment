import { getStudentAssignments, getStudentCbtExams } from "@/actions/student";
import StudentClient from "./StudentClient";

export default async function StudentDashboardPage() {
  const [{ assignments, error }, { exams: cbtExams }] = await Promise.all([
    getStudentAssignments(),
    getStudentCbtExams()
  ]);

  return (
    <StudentClient
      initialAssignments={assignments || []}
      initialCbtExams={cbtExams || []}
      error={error}
    />
  );
}
