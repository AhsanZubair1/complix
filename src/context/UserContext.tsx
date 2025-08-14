import { createContext, useContext, useEffect, useState } from "react";
import { fetchUsers } from "../api/User/UserApi";
import { User } from "../api/User/UserType.type";

interface UserContextType {
  users: User[];
  isLoading: boolean;
  error: string | null;
  refreshUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  users: [],
  isLoading: false,
  error: null,
  refreshUsers: async () => {},
});

export const useUsers = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchUsers();
      setUsers(response.results);
    } catch (err) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <UserContext.Provider
      value={{
        users,
        isLoading,
        error,
        refreshUsers: fetchAllUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
