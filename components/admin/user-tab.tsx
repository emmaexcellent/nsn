import { Card, CardContent } from "@/components/ui/card";
import { Models } from "appwrite";
import SearchBar from "./search";
import UserCard from "./user-card";

interface UsersTabProps {
  users: Models.DefaultDocument[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function UsersTab({
  users,
  searchTerm,
  onSearchChange,
}: UsersTabProps) {
  const filteredUsers = users.filter(
    (u) =>
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SearchBar
          placeholder="Search users..."
          value={searchTerm}
          onChange={onSearchChange}
        />
        <div className="text-sm text-muted-foreground">
          Total users: {users.length}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.$id}
            user={user}
          />
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No users found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
