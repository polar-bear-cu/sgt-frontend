import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <h2>Profile</h2>
      {isAuthenticated ? <p>TODO: view + edit profile</p> : <p>Please Login bro...</p>}
    </div>
  );
}
