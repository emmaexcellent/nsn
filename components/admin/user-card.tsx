import { Card, CardContent } from "@/components/ui/card";
import { Calendar, GraduationCap,  Mail } from "lucide-react";
import { Models } from "appwrite";

interface UserCardProps {
  user: Models.DefaultDocument;
}

export default function UserCard({
  user
}: UserCardProps) {

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">
                {user.firstName} {user.lastName}
              </h3>
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
            </div>
          </div>
          {/* <div className="flex gap-2">
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
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}
