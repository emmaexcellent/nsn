import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, GraduationCap, UserCheck, Mail, Eye } from "lucide-react";
import { Models } from "appwrite";

interface UserCardProps {
  user: Models.Document;
  onContact: (user: Models.Document) => void;
  onViewProfile: (user: Models.Document) => void;
}

export default function UserCard({
  user,
  onContact,
  onViewProfile,
}: UserCardProps) {
  // Calculate profile completion percentage
  const calculateProfileCompletion = (user: Models.Document) => {
    const fields = ["name", "email", "bio", "education", "interests"];
    const completedFields = fields.filter(
      (field) => user[field] && user[field].toString().trim() !== ""
    );
    return Math.round((completedFields.length / fields.length) * 100);
  };

  const profileComplete = calculateProfileCompletion(user);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">
                {user.name || "Unnamed User"}
              </h3>
              <Badge
                variant={user.status === "active" ? "default" : "secondary"}
              >
                {user.status || "unknown"}
              </Badge>
              <Badge
                variant="outline"
                className={
                  profileComplete >= 80 ? "bg-green-50" : "bg-yellow-50"
                }
              >
                {profileComplete}% complete
              </Badge>
            </div>
            <p className="text-muted-foreground mb-2 flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {user.email || "No email"}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined{" "}
                {user.$createdAt
                  ? new Date(user.$createdAt).toLocaleDateString()
                  : "Unknown date"}
              </span>
              <span className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4" />
                {user.applications || 0} applications
              </span>
              <span className="flex items-center gap-1">
                <UserCheck className="h-4 w-4" />
                Last active: {user.lastActive || "Unknown"}
              </span>
            </div>
            {user.bio && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {user.bio}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewProfile(user)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button variant="outline" size="sm" onClick={() => onContact(user)}>
              <Mail className="h-4 w-4 mr-1" />
              Contact
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
