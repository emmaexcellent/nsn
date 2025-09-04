export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="w-full max-w-6xl mx-auto px-4 space-y-6">
        {/* Header Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Profile Overview Skeleton */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 space-y-4">
              <div className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center space-y-1">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form Skeleton */}
          <div className="md:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg border">
              {/* Tabs Skeleton */}
              <div className="border-b p-6">
                <div className="flex space-x-8">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>

              {/* Form Content Skeleton */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-4">
                  <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
