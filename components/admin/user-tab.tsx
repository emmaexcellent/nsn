import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, GraduationCap, UserCheck, Mail, Eye } from "lucide-react";
import { Models } from "appwrite";
import SearchBar from "./search";
import UserCard from "./user-card";

interface UsersTabProps {
  users: Models.Document[];
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

  const handleContactUser = (user: Models.Document) => {
    // Implement contact functionality
    window.location.href = `mailto:${user.email}`;
  };

  const handleViewProfile = (user: Models.Document) => {
    // Implement view profile functionality
    console.log("View profile:", user);
    // router.push(`/profile/${user.$id}`);
  };

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

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.$id}
            user={user}
            onContact={handleContactUser}
            onViewProfile={handleViewProfile}
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
