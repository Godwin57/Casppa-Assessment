import { getAcademicOversightData } from "@/actions/admin";
import DashboardClient from "./DashboardClient";

export default async function ProprietorDashboardHome() {
  const data = await getAcademicOversightData();

  if ("error" in data || !data.metrics) {
    return (
      <div className="p-6 text-red-500">
        Failed to load dashboard data: {data.error || "Unknown error"}
      </div>
    );
  }

  return <DashboardClient data={data} />;
}
