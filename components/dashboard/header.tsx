
interface DashboardHeaderProps {
  firstName: string;
}

export default function DashboardHeader({ firstName }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Welcome back, {firstName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your scholarship journey and discover new opportunities
        </p>
      </div>
    </div>
  );
}
