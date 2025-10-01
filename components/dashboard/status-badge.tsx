import { Badge } from "@/components/ui/badge";
import {
  Heart,
  CheckCircle,
  Clock,
  FileText,
  Award,
  AlertCircle,
} from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "saved":
        return "bg-blue-100 text-blue-800";
      case "applied":
        return "bg-green-100 text-green-800";
      case "submitted":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-orange-100 text-orange-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "recommended":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "saved":
        return <Heart className="h-3 w-3" />;
      case "applied":
        return <CheckCircle className="h-3 w-3" />;
      case "submitted":
        return <Clock className="h-3 w-3" />;
      case "in-progress":
        return <FileText className="h-3 w-3" />;
      case "accepted":
        return <Award className="h-3 w-3" />;
      case "recommended":
        return <Award className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  return (
    <Badge className={getStatusColor(status)}>
      {getStatusIcon(status)}
      <span className="ml-1 capitalize">{status}</span>
    </Badge>
  );
}
