import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <h2>Dashboard</h2>
      {isAuthenticated ? <p>TODO: report summary</p> : <p>Please Login bro...</p>}
    </div>
  );
}
