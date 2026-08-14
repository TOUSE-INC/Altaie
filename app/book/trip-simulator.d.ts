export type TripStageId =
  | "requested"
  | "reviewed"
  | "confirmed"
  | "assigned"
  | "en-route"
  | "complete";

export type TripStage = {
  id: TripStageId;
  label: string;
  headline: string;
  eta: number;
  nextEvent: string;
};

export type TripSnapshot = {
  stageIndex: number;
  stageId: TripStageId;
  headline: string;
  etaMinutes: number;
  nextEvent: string;
};

export const TRIP_STAGES: readonly TripStage[];

export function getTripSnapshot(
  stageIndex: number,
  elapsedSeconds?: number,
): TripSnapshot;

export function advanceTripStage(stageIndex: number): number;
