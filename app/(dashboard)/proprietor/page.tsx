import { getAcademicOversightData } from "@/actions/admin";
import DashboardClient from "./DashboardClient";

export default async function ProprietorDashboardHome() {
  const data = await getAcademicOversightData();

  if (data.error) {
    return (
      <div className="p-8 text-red-500">
        Failed to load dashboard data. Check database connection.
      </div>
    );
  }

  return <DashboardClient data={data} />;
}
