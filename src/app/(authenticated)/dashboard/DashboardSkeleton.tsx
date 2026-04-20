/**
 * Skeleton loading untuk halaman Dashboard.
 * Tampil saat data sedang di-fetch dari server.
 */
export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-pulse">
      {/* Greeting skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="skeleton h-8 w-64 rounded-lg mb-2" />
          <div className="skeleton h-4 w-48 rounded-lg" />
        </div>
        <div className="skeleton h-10 w-32 rounded-xl" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-5">
            <div className="skeleton w-10 h-10 rounded-xl mb-3" />
            <div className="skeleton h-7 w-16 rounded-lg mb-1" />
            <div className="skeleton h-3 w-24 rounded" />
          </div>
        ))}
      </div>

      {/* XP Card skeleton */}
      <div className="card p-6">
        <div className="flex justify-between mb-4">
          <div className="skeleton h-6 w-32 rounded-lg" />
          <div className="skeleton h-8 w-24 rounded-lg" />
        </div>
        <div className="skeleton h-3 w-full rounded-full" />
      </div>

      {/* Main grid skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="skeleton h-5 w-40 rounded mb-4" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-20 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="card p-6">
            <div className="skeleton h-5 w-32 rounded mb-4" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 mb-3">
                <div className="skeleton w-9 h-9 rounded-lg flex-shrink-0" />
                <div className="flex-1">
                  <div className="skeleton h-4 w-full rounded mb-1" />
                  <div className="skeleton h-3 w-2/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
