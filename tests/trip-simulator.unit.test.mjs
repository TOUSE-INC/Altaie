import assert from "node:assert/strict";
import test from "node:test";
import {
  advanceTripStage,
  getTripSnapshot,
  TRIP_STAGES,
} from "../app/book/trip-simulator.mjs";

test("assigned demo starts twenty minutes before pickup", () => {
  assert.equal(TRIP_STAGES[3].id, "assigned");
  assert.deepEqual(getTripSnapshot(3, 0), {
    stageIndex: 3,
    stageId: "assigned",
    headline: "Your chauffeur is assigned.",
    etaMinutes: 20,
    nextEvent: "Pickup",
  });
});

test("elapsed demo time lowers ETA without going below one minute", () => {
  assert.equal(getTripSnapshot(4, 125).etaMinutes, 9);
  assert.equal(getTripSnapshot(4, 9999).etaMinutes, 1);
});

test("advance clamps at complete", () => {
  assert.equal(advanceTripStage(3), 4);
  assert.equal(
    advanceTripStage(TRIP_STAGES.length - 1),
    TRIP_STAGES.length - 1,
  );
});
