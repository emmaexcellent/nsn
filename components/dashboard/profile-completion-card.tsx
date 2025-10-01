import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface ProfileCompletionCardProps {
  profileCompletion: number;
}

export default function ProfileCompletionCard({
  profileCompletion,
}: ProfileCompletionCardProps) {
  return (
    <Card className="mb-8 border-gold/20 bg-gold/5">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Complete Your Profile
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              A complete profile helps us recommend better scholarship matches
            </p>
          </div>
          <Button className="bg-gold hover:bg-gold/90 text-navy">
            Complete Profile
          </Button>
        </div>
        <Progress value={profileCompletion} className="h-2" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {profileCompletion}% complete - Add your academic achievements and
          career goals
        </p>
      </CardContent>
    </Card>
  );
}
