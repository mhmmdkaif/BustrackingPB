import BusCard from "./BusCard";

export default function BusList({
  buses = [],
  liveBusData = {},
  onTrackBus
}) {
  if (buses.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg border text-center text-sm text-gray-500">
        No buses found for this route
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      {buses.map((bus) => {
        const liveInfo = liveBusData[bus.id];

        return (
          <BusCard
            key={bus.id}
            bus={bus}
            isLive={!!liveInfo}
            eta={liveInfo?.eta_minutes ?? null}
            onTrack={onTrackBus}
          />
        );
      })}
    </div>
  );
}
