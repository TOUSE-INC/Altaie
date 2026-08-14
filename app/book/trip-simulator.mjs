export const TRIP_STAGES = [
  {
    id: "requested",
    label: "Requested",
    headline: "Your request is with the desk.",
    eta: 45,
    nextEvent: "Desk review",
  },
  {
    id: "reviewed",
    label: "Reviewed",
    headline: "Your itinerary is reviewed.",
    eta: 35,
    nextEvent: "Confirmation",
  },
  {
    id: "confirmed",
    label: "Confirmed",
    headline: "Your trip is confirmed.",
    eta: 28,
    nextEvent: "Assignment",
  },
  {
    id: "assigned",
    label: "Assigned",
    headline: "Your chauffeur is assigned.",
    eta: 20,
    nextEvent: "Pickup",
  },
  {
    id: "en-route",
    label: "En route",
    headline: "Your chauffeur is approaching.",
    eta: 12,
    nextEvent: "Pickup",
  },
  {
    id: "complete",
    label: "Complete",
    headline: "Your movement is complete.",
    eta: 1,
    nextEvent: "Arrival",
  },
];

export function getTripSnapshot(stageIndex, elapsedSeconds = 0) {
  const safeIndex = Math.min(
    Math.max(Number.isFinite(stageIndex) ? Math.trunc(stageIndex) : 0, 0),
    TRIP_STAGES.length - 1,
  );
  const stage = TRIP_STAGES[safeIndex];
  const elapsedMinutes = Math.ceil(
    Math.max(Number.isFinite(elapsedSeconds) ? elapsedSeconds : 0, 0) / 60,
  );

  return {
    stageIndex: safeIndex,
    stageId: stage.id,
    headline: stage.headline,
    etaMinutes: Math.max(1, stage.eta - elapsedMinutes),
    nextEvent: stage.nextEvent,
  };
}

export function advanceTripStage(stageIndex) {
  const safeIndex = Math.min(
    Math.max(Number.isFinite(stageIndex) ? Math.trunc(stageIndex) : 0, 0),
    TRIP_STAGES.length - 1,
  );
  return Math.min(safeIndex + 1, TRIP_STAGES.length - 1);
}
