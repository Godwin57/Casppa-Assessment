import { getStudentAssignments } from "@/actions/student";
import StudentClient from "./StudentClient";

export default async function StudentDashboardPage() {
  const { assignments, error } = await getStudentAssignments();

  return (
    <StudentClient
      initialAssignments={assignments || []}
      error={error}
    />
  );
}
