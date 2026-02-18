export default function Header() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* App Name */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600"></span>
          <h1 className="text-lg font-semibold text-blue-900">
            ChaloPB
          </h1>
        </div>

        {/* Tagline / Trust text */}
        <p className="text-xs text-gray-500 hidden sm:block">
          Live Punjab Bus Tracking
        </p>

      </div>
    </header>
  );
}
