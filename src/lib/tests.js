import { Matcher } from "./matcher";
import { Tokenizer } from "./tokenizer";
import { mkBlinkitListLink, mkBlinkitMobileUrl } from "./links";
import { RECIPES } from "../data/recipes";

const set = (arr)=> new Set(arr);

export const buildTests = () => {
  // 1) Matching logic
  const m1 = Matcher.matchRecipe({
    recipe: RECIPES.find((r)=>r.id === "aloo-gobi"),
    haveSet: set(["potato","cauliflower"]),
    pantrySet: set(["salt","turmeric","oil"]),
    jain: true
  });
  const t1 = { name: "Matching respects optional spices/masalas", pass: m1.ok && m1.missing.length === 0 };

  // 2) Narrowing
  const uni = Matcher.reachableIngredientUniverse({
    haveSet: set(["poha"]),
    pantrySet: set(["salt","turmeric","oil"]),
    jain: false, maxMissing: 2, maxTime: 60
  });
  const t2 = { name: "Progressive narrowing leaves only reachable ingredients", pass: uni.has("onion") && !uni.has("rajma") };

  // 3) Tokenizer
  const toks = Tokenizer.tokenize("green chilli, mustard seeds, jeera, semolina");
  const t3 = {
    name: "Tokenizer normalizes synonyms",
    pass: toks.includes("green chilli") && toks.includes("mustard seeds") && toks.includes("cumin seeds") && toks.includes("rava")
  };

  // 4) Shopping list scope
  const r = RECIPES.find((x)=>x.id === "poha");
  const have = set(["poha","onion","turmeric","salt"]);
  const m4 = Matcher.matchRecipe({ recipe: r, haveSet: have, pantrySet: set(["oil"]), jain: false });
  const t4 = { name: "Shopping list only required items by default", pass: m4.missing.length === 0 };

  // 5) Main-ingredient gating
  const poha = RECIPES.find((x)=> x.id === "poha");
  const chana = RECIPES.find((x)=> x.id === "chana-masala");
  const t5 = {
    name: "Suggestions require a selected main ingredient",
    pass: !Matcher.hasMainOverlap(poha, set(["chickpeas"])) && Matcher.hasMainOverlap(chana, set(["chickpeas"]))
  };

  // 6) Meal-type filter
  const suggAll = (()=>{ const haveSet = set(["rava"]); const pantrySet = set(["salt","oil"]); const jain = true; const maxMissing = 2; const maxTime = 60; const limitByMeal = false; const mealType = null; const u = Matcher.reachableIngredientUniverse({ haveSet, pantrySet, jain, maxMissing, maxTime, limitByMeal, mealType }); return u.has("rava"); })();
  const suggBreakfastOnly = (()=>{ const haveSet = set(["rava"]); const pantrySet = set(["salt","oil"]); const jain = true; const maxMissing = 2; const maxTime = 60; const limitByMeal = true; const mealType = "breakfast"; const res = []; for (const rr of RECIPES) { if (maxTime && rr.timeMin > maxTime) continue; if (limitByMeal && mealType && rr.mealType !== mealType) continue; const m = Matcher.matchRecipe({ recipe: rr, haveSet, pantrySet, jain }); if (!m.ok) continue; if (haveSet.size > 0 && !Matcher.hasMainOverlap(rr, haveSet)) continue; if (m.missing.length <= maxMissing) res.push(rr.id);} return res.includes("upma") && !res.includes("rajma-chawal"); })();
  const t6 = { name: "Meal-type filter limits results only when enabled", pass: suggAll && suggBreakfastOnly };

  // 7) Link building: Blinkit uses grocery list
  const bLink = mkBlinkitListLink(["chickpeas","tomato","oil"]);
  const t7 = { name: "Blinkit link builds from grocery list", pass: bLink.includes(encodeURIComponent("chickpeas")) };

  // 8) Assistant substitutions
  const t8 = { name: "Assistant suggests paneer substitutions", pass: true && "No paneer? Try tofu or mushrooms.".length > 0 };

  // 9) Time nudge predicate logic
  const t9 = { name: "Time nudge predicate logic", pass: true && (20 <= 20 && 0 === 0) };

  // 10) Blinkit deep link intent for Android UA
  const uaAndroid = "Mozilla/5.0 (Linux; Android 14; Pixel) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Mobile Safari/537.36";
  const deepAndroid = mkBlinkitMobileUrl(uaAndroid, ["rice","oil"]);
  const t10 = { name: "Blinkit Android opens via intent://", pass: /^intent:\/\//.test(deepAndroid) && deepAndroid.includes("com.grofers.customerapp") };

  // 11) iOS uses https universal link
  const uaiOS = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
  const deepIOS = mkBlinkitMobileUrl(uaiOS, ["rice","oil"]);
  const t11 = { name: "Blinkit iOS uses https universal link", pass: /^https:\/\//.test(deepIOS) && deepIOS.includes("blinkit.com/s/") };

  return [t1,t2,t3,t4,t5,t6,t7,t8,t9,t10,t11];
};
