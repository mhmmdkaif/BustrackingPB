import BusList from "./BusList";

export default function ResultsSection({
  buses,
  liveBusData,
  onTrackBus
}) {
  // If user hasn't searched yet
  if (!buses) {
    return null;
  }

  return (
    <section className="max-w-5xl mx-auto px-4 mt-8">
      
      {/* Section title */}
      <h2 className="text-lg font-semibold text-blue-900 mb-4">
        Available buses
      </h2>

      {/* Bus list */}
      <BusList
        buses={buses}
        liveBusData={liveBusData}
        onTrackBus={onTrackBus}
      />

    </section>
  );
}
