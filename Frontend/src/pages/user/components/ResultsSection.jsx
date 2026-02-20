import BusList from "./BusList";

export default function ResultsSection({
  buses,
  liveBusData,
  onTrackBus
}) {
  // Not searched yet
  if (!buses) return null;

  return (
    <section className="max-w-xl mx-auto px-4 mt-6">

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-slate-800">
          Available Buses
        </h2>

        <span className="text-xs text-slate-500">
          {buses.length} found
        </span>
      </div>

      <BusList
        buses={buses}
        liveBusData={liveBusData}
        onTrackBus={onTrackBus}
      />

    </section>
  );
}
