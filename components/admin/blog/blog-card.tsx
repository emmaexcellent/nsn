import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, BookOpen, Eye, Calendar, Trash2 } from "lucide-react";
import { Models } from "appwrite";
import Image from "next/image";

interface BlogPostCardProps {
  post: Models.Document;
  onEdit: (post: Models.Document) => void;
  isLoading: boolean;
  onDelete: (id: string) => void;
}

export default function BlogPostCard({
  post,
  onEdit,
  isLoading,
  onDelete,
}: BlogPostCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 p-4">
        <Image
          src={post.imageUrl || "/default-image.jpg"}
          alt={post.title}
          width={300}
          height={300}
          className="h-20 w-20 rounded-lg object-cover"
        />
        <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="line-clamp-2 text-lg font-semibold">{post.title}</h3>
              <Badge
                variant={post.status === "published" ? "default" : "secondary"}
              >
                {post.status}
              </Badge>
            </div>
            <p className="mb-2 text-sm text-muted-foreground">
              By {post.author || "Unknown Author"}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {post.category || "Uncategorized"}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {post.views || 0} views
              </span>
              {post.publishedAt ? (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(post)}
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
                  `Delete blog post "${post.title}"? This cannot be undone.`
                );

                if (confirmed) {
                  onDelete(post.$id);
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
