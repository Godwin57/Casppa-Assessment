import { getTeacherAssignments } from "@/actions/teacher";
import TeacherClient from "./TeacherClient";

export default async function TeacherDashboardPage() {
  const { assignments, error } = await getTeacherAssignments();

  return (
    <TeacherClient
      initialAssignments={assignments || []}
      error={error}
    />
  );
}
