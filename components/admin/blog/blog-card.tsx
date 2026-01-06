import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, BookOpen, Eye, Calendar } from "lucide-react";
import { Models } from "appwrite";
import { useState } from "react";
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
  const [postIdToDelete, setPostIdToDelete] = useState<string | null>(null);
  const showLoading = postIdToDelete === post.$id;

  console.log("BlogPostCard render:", post?.imageUrl && post.imageUrl);

  return (
    <Card>
      <CardContent className="p-3 flex items-center justify-stretch gap-3">
        <Image
          src={post.imageUrl || "/default-image.jpg"}
          alt={post.title}
          width={300}
          height={300}
          className="w-20 h-20 object-cover rounded-lg"
          priority
        />
        <div className="flex-1 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold line-clamp-2">
                {post.title}
              </h3>
              <Badge
                variant={post.status === "published" ? "default" : "secondary"}
              >
                {post.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-2">
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
              {post.publishedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {post.publishedAt}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(post)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setPostIdToDelete(post.$id);
                onDelete(post.$id);
              }}
              disabled={isLoading && showLoading}
            >
              {isLoading && showLoading ? "Deleting" : "Delete"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
