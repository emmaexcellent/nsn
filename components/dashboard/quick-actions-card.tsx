import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, UserCircle } from "lucide-react";
import Link from "next/link";

export default function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link href="/scholarships">
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
          >
            <BookOpen className="h-3 w-3 mr-2" />
            Browse Scholarships
          </Button>
        </Link>
        <Link href="/blog">
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
          >
            <FileText className="h-3 w-3 mr-2" />
            Application Tips
          </Button>
        </Link>
        <Link href="/profile">
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
          >
            <UserCircle className="h-3 w-3 mr-2" />
            Update Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
