import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, DollarSign, Calendar, Users } from "lucide-react";
import { Models, Query } from "appwrite";
import { useEffect, useState } from "react";
import { databaseId, databases } from "@/lib/appwrite";

interface ScholarshipCardProps {
  scholarship: Models.DefaultDocument;
  isLoading: boolean;
  onEdit: (scholarship: Models.DefaultDocument) => void;
  onDelete: (id: string) => void;
}

export default function ScholarshipCard({
  scholarship,
  isLoading,
  onEdit,
  onDelete,
}: ScholarshipCardProps) {
  const [applications, setApplications] = useState(0);
  const [scholarshipToDelete, setScholarshipToDelete] = useState<string | null>(
    null
  );
  const showLoading = scholarshipToDelete === scholarship.$id;

  useEffect(() => {
    const getScholarshipApplications = async () => {
      const response = await databases.listDocuments(
        databaseId,
        "saved_scholarships",
        [
          Query.equal("scholarship", scholarship.$id),
          Query.equal("action", "apply"),
        ]
      );

      setApplications(response.total);
    };
    getScholarshipApplications();
  }, [scholarship.$id]);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
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
            </div>
            <p className="text-muted-foreground mb-2">{scholarship.provider}</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {scholarship.currency || "NGN"}{" "}
                {scholarship.amount?.toLocaleString()}
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
                {applications || 0} applications
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(scholarship)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setScholarshipToDelete(scholarship.$id);
                onDelete(scholarship.$id);
              }}
              disabled={isLoading && showLoading}
            >
              {isLoading && showLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
