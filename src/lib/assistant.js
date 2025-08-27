import { ING_TO_CAT } from "../data/ingredients";

const SUBS = { paneer:["tofu","mushrooms"], ghee:["oil","butter"], curd:["yogurt"], yogurt:["curd"], rice:["poha","rava"], tomato:["capsicum"], onion:["asafoetida"] };

const getSubstitutionHints = (missingNames) => {
  const hints=[], seen=new Set();
  for (const n of missingNames) {
    const key=(n||"").toLowerCase();
    if (SUBS[key] && !seen.has(key)) {
      hints.push(`No ${key}? Try ${SUBS[key].join(" or ")}.`);
      seen.add(key);
    }
  }
  return hints;
};

const timeNudgePredicate = (maxTime, suggestionsLen) => maxTime <= 20 && suggestionsLen === 0;

const profileSelection = (selectedSet) => {
  const counts = { "Fresh Produce":0, Grains:0, Pulses:0, Dairy:0, Oils:0, Spices:0, Other:0 };
  selectedSet.forEach((ing)=>{ const cat = ING_TO_CAT.get(ing) || "Other"; if (counts[cat] != null) counts[cat]++; });
  const top = Object.entries(counts).sort((a,b)=> b[1]-a[1])[0];
  return { counts, topCat: top && top[1] > 0 ? top[0] : null };
};

const adaptiveNudge = ({ selectedSet }) => {
  const { topCat } = profileSelection(selectedSet);
  if (topCat === "Pulses") return "You seem to enjoy lentils. Want me to surface more dal-based ideas?";
  if (topCat === "Grains") return "Plenty of grain options here. Quick pulao or upma sound good?";
  return null;
};

export const Assistant = { getSubstitutionHints, timeNudgePredicate, adaptiveNudge };
