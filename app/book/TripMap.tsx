"use client";

import { CarProfile } from "@phosphor-icons/react";
import Image from "next/image";

const STAGE_POSITIONS = [
  { left: "26.2%", top: "16.2%" },
  { left: "26.2%", top: "16.2%" },
  { left: "26.2%", top: "16.2%" },
  { left: "30.2%", top: "33.2%" },
  { left: "53.6%", top: "71.5%" },
  { left: "73%", top: "88.7%" },
];

type TripMapProps = {
  stageIndex: number;
  live?: boolean;
};

export function TripMap({ stageIndex, live = false }: TripMapProps) {
  const safeStageIndex = Math.min(Math.max(stageIndex, 0), 5);

  return (
    <div
      className="trip-map__canvas"
      data-testid="trip-map"
      aria-label="Illustrative route map of Washington, DC, from The Hay-Adams to Reagan National Airport"
    >
      <Image
        src="/images/trip/altaie-dc-route-map.webp"
        alt="Illustrative route map of Washington, DC"
        fill
        priority
        sizes="(max-width: 760px) 100vw, 980px"
      />
      <span
        className={`trip-map__vehicle ${live ? "is-live" : ""}`}
        style={STAGE_POSITIONS[safeStageIndex]}
        aria-label={`Simulated vehicle position at ${safeStageIndex === 5 ? "the destination" : safeStageIndex === 4 ? "the midpoint of the route" : "the pickup side of the route"}`}
      >
        <CarProfile size={18} weight="fill" aria-hidden="true" />
      </span>
    </div>
  );
}
