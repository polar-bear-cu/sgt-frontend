import { useAuth } from "@/context/AuthContext";

export default function SubscriptionsPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <h2>Subscriptions</h2>
      {isAuthenticated ? <p>TODO: list + create subscription</p> : <p>Please Login bro...</p>}
    </div>
  );
}
