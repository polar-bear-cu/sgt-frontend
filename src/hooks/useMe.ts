import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/users";
import { useAuth } from "@/context/AuthContext";

export function useMe(enabled = true) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["me"],
    queryFn: () => getMe(user?.id ?? ""),
    enabled: enabled && Boolean(user),
  });
}
