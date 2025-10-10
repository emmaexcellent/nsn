import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User2 } from "lucide-react";
import { Models } from "appwrite";

interface UserProfileCardProps {
  user: Models.DefaultDocument | null;
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="relative w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-gray-200">
          <User2 className="object-cover" />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {user?.firstName} {user?.lastName}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {user?.email}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Member since {new Date(user?.$createdAt || "").toLocaleDateString()}
        </p>
        <Button
          variant="outline"
          className="w-full mt-4 bg-transparent"
          size="sm"
        >
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  );
}
