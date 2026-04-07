import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, DollarSign, Calendar, Users, Trash2, Coins } from "lucide-react";
import { Models } from "appwrite";

interface ScholarshipCardProps {
  scholarship: Models.Document;
  isLoading: boolean;
  onEdit: (scholarship: Models.Document) => void;
  onDelete: (id: string) => void;
}

export default function ScholarshipCard({
  scholarship,
  isLoading,
  onEdit,
  onDelete,
}: ScholarshipCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold">{scholarship.title}</h3>
              <Badge
                variant={
                  scholarship.status === "active"
                    ? "default"
                    : scholarship.status === "expired"
                    ? "destructive"
                    : "secondary"
                }
              >
                {scholarship.status}
              </Badge>
              {scholarship.category ? (
                <Badge variant="outline">{scholarship.category}</Badge>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">
              {scholarship.sponsor || scholarship.provider}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Coins className="h-4 w-4" />
                {scholarship.currency || "USD"}{" "}
                {Number(scholarship.amount || 0).toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {scholarship.deadline
                  ? new Date(scholarship.deadline).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Not Specified"}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {scholarship.applicationCount || 0} applications
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(scholarship)}
              disabled={isLoading}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isLoading}
              onClick={() => {
                const confirmed = window.confirm(
                  `Delete scholarship "${scholarship.title}"? This cannot be undone.`
                );

                if (confirmed) {
                  onDelete(scholarship.$id);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
