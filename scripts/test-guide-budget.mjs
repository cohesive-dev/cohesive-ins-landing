import assert from "node:assert/strict";
import { calculateBudget, budgetCsv, budgetNumber, OPENING_COSTS, MONTHLY_COSTS } from "../lib/guides/budget.ts";
import { RESTAURANT_GUIDES } from "../lib/guides/restaurant.ts";
import { STARTUP_STATES, SPECIAL_TRADE_RESOURCES } from "../lib/guides/states.ts";
import { startupPlacementRestriction } from "../lib/guides/eligibility.ts";
import { readFileSync } from "node:fs";

// Financial behavior: reserve, contingency basis, funding gap, and exported precision.
const scenario = calculateBudget(["10000", "5000"], ["2000", "3000"], "3", "10", "20000");
assert.equal(scenario.total, 31500);
assert.equal(scenario.contingencyTotal, 1500);
assert.equal(scenario.reserve, 15000);
assert.equal(scenario.gap, 11500);
assert.equal(calculateBudget([], [], "", "", "").total, 0);
assert.equal(calculateBudget(["100"], [], "0", "0", "200").gap, 0);
assert.equal(budgetNumber("-10"), 0);
assert.equal(budgetNumber("Infinity"), 0);
assert.equal(budgetNumber("not a number"), 0);
assert.equal(calculateBudget(["100"], ["1"], "61", "101", "0").total, 260);
const csv = budgetCsv(["100.25"], ["25.50"], "2", "10", "0");
assert.match(csv, /"Estimated total cash needed","161.28"/);
for (const label of [...OPENING_COSTS, ...MONTHLY_COSTS]) assert.ok(csv.includes(label));

// Every internal guide link and TOC target must resolve to an authored page/section.
assert.equal(new Set(RESTAURANT_GUIDES.map((g) => g.slug)).size, 6);
const paths = new Set(RESTAURANT_GUIDES.map((g) => `/guides/${g.slug}`));
for (const guide of RESTAURANT_GUIDES) {
  assert.equal(new Set(guide.sections.map((s) => s.id)).size, guide.sections.length);
  for (const section of guide.sections) {
    for (const link of section.links ?? []) {
      if (link.href.startsWith("/guides/")) assert.ok(paths.has(link.href), link.href);
    }
  }
}
assert.equal(STARTUP_STATES.length, 50);
assert.equal(new Set(STARTUP_STATES.map((s) => s.slug)).size, 50);
const registration = JSON.parse(readFileSync(new URL("../lib/guides/registration.json", import.meta.url), "utf8"));
for (const state of STARTUP_STATES) {
  assert.ok(registration.states[state.slug], `Missing registration: ${state.name}`);
  assert.ok(state.food.note.length > 80);
  assert.ok(state.construction.note.length > 80);
  assert.match(state.food.href, /^https:\/\//);
  assert.match(state.construction.href, /^https:\/\//);
}
assert.ok(SPECIAL_TRADE_RESOURCES["janitorial:oregon"]);
assert.ok(SPECIAL_TRADE_RESOURCES["tree-service:new-jersey"]);
assert.ok(startupPlacementRestriction("california", "Janitorial"));
assert.ok(startupPlacementRestriction("new-york", "Roofing"));
assert.ok(startupPlacementRestriction("florida", "Roofing"));
assert.equal(startupPlacementRestriction("washington", "Roofing"), null);
assert.equal(startupPlacementRestriction("michigan", "Restaurants"), null);
assert.equal(startupPlacementRestriction("new-york", "Remodeling"), null);
console.log("Budget scenarios, CSV export, 50-state sources, placement restrictions, and guide link integrity passed.");
