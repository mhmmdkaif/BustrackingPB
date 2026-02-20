export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">

      <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* App Name */}
        <div className="flex items-center gap-2">

          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />

          <h1 className="text-base font-semibold text-slate-800">
            ChaloPB
          </h1>

        </div>

        {/* Tagline */}
        <p className="text-xs text-slate-500">
          Live bus tracking
        </p>

      </div>

    </header>
  );
}
