import { getTeacherAssignments, getTeacherCbtExams } from "@/actions/teacher";
import TeacherClient from "./TeacherClient";

export default async function TeacherDashboardPage() {
  const [{ assignments, error }, { exams: cbtExams }] = await Promise.all([
    getTeacherAssignments(),
    getTeacherCbtExams()
  ]);

  return (
    <TeacherClient
      initialAssignments={assignments || []}
      initialCbtExams={cbtExams || []}
      error={error}
    />
  );
}
