import BusCard from "./BusCard";

export default function BusList({
  buses = [],
  liveBusData = {},
  onTrackBus
}) {

  if (buses.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-sm text-slate-500">
        No active buses right now for this route
      </div>
    );
  }

  return (
    <div className="space-y-3">
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
