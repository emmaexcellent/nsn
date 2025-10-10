"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, FileText, Eye, LucideProps } from "lucide-react";
import { Models } from "appwrite";

interface DashboardOverviewProps {
  scholarships: Models.DefaultDocument[];
  blogPosts: Models.DefaultDocument[];
  users: Models.DefaultDocument[];
}

export default function DashboardOverview({
  scholarships,
  blogPosts,
  users,
}: DashboardOverviewProps) {
  // Filter users created this month
  const usersThisMonth = users.filter((user) => {
    const userCreatedDate = new Date(user.$createdAt);
    const now = new Date();
    return (
      userCreatedDate.getMonth() === now.getMonth() &&
      userCreatedDate.getFullYear() === now.getFullYear()
    );
  });

  const stats = {
    scholarships: {
      total: scholarships.length,
      active: scholarships.filter((s) => s.status === "active").length,
    },
    users: {
      total: users.length,
      newThisMonth: usersThisMonth.length, // You might want to calculate this based on actual data
    },
    blog: {
      total: blogPosts.length,
      views: blogPosts.reduce((sum, post) => sum + (post.views || 0), 0),
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Scholarships"
          value={stats.scholarships.total}
          subtitle={`${stats.scholarships.active} active`}
          icon={GraduationCap}
        />
        <StatCard
          title="Registered Users"
          value={stats.users.total}
          subtitle={`+${stats.users.newThisMonth} this month`}
          icon={Users}
        />
        <StatCard
          title="Blog Posts"
          value={stats.blog.total}
          subtitle={`${stats.blog.views} total views`}
          icon={FileText}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* <RecentApplications scholarships={scholarships} /> */}
        <PopularBlogPosts blogPosts={blogPosts} />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ComponentType<LucideProps>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}


function PopularBlogPosts({ blogPosts }: { blogPosts: Models.DefaultDocument[] }) {
  const popularPosts = blogPosts
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Blog Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {popularPosts.map((post) => (
            <div key={post.$id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{post.title}</p>
                <p className="text-sm text-muted-foreground">
                  {post.views || 0} views
                </p>
              </div>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
