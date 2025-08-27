const MAP = new Map([
  ["chilli","green chilli"],["chilies","green chilli"],["methi leaves","kasuri methi"],
  ["coriander","coriander leaves"],["dhaniya","coriander powder"],["jeera","cumin seeds"],
  ["hing","asafoetida"],["atta","wheat flour"],["buttermilk","curd"],["semolina","rava"],
  ["sooji","rava"],["yoghurt","curd"],["methi seeds","fenugreek seeds"]
]);

const normalize = (s) => MAP.get(s.trim().toLowerCase()) || s.trim().toLowerCase();

export const Tokenizer = {
  normalize,
  tokenize: (text) => text.split(/[\n,]+/).map((x)=>normalize(x)).filter(Boolean)
};
