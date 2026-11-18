import { AdminDashboard } from "./dashboard";

export const metadata = { title: "Advancement CMS" };
export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <AdminDashboard />;
}
