const mappings = {
  ballon: ["ballon", "luftballon"],
  banane: ["banane", "obstbanane", "bananen"],
  birne: ["birne", "birnen"],
  blume: ["blume", "blumen", "blüte"],
  brief: ["brief", "schreiben", "post", "liebebrief", "briefe"],
  buch: ["buch", "lektüre"],
  erdbeere: ["erdbeere", "beere", "erdbeeren"],
  fahrrad: ["fahrrad", "rad", "bike", "drahtesel"],
  fisch: ["fisch", "karpfen", "forelle", "forellen", "fische"],
  gans: ["gans", "vogel", "ente", "schwan"],
  glocke: ["glocke", "schelle", "klingel", "glocken", "schellen"],
  hammer: ["hammer", "schlägel", "klöpfel", "klüpfel"],
  hund: ["hund", "hündin", "kläffer", "köter", "wauwau"],
  kirsche: ["kirsche", "kirschen"],
  kiste: ["kiste", "box", "verpackung", "schachtel"],
  knopf: ["knopf", "knöpfe"],
  koffer: ["koffer", "gepäck"],
  nagel: ["nagel", "bolzen"],
  papagei: ["papagei", "wellensittich", "kakadu"],
  pfeife: ["pfeife", "pfeifen"],
  schaufel: ["schaufel", "schippe"],
  schirm: ["schirm", "regenschirm", "parapluie"],
  schleife: ["schleife"],
  schwein: ["schwein", "wutz", "sau", "wildschwein", "wildsau"],
  stuhl: ["stuhl", "sitzplatz", "platz", "sitzgelegenheit"],
  tasche: ["tasche", "handtasche", "tragetasche", "taschen"],
  tasse: ["tasse", "becher"],
  trichter: ["trichter"],
  trommel: ["trommel", "marschtrommel"],
  uhr: ["uhr", "armbanduhr"],
  zaun: ["zaun", "gitter", "gatter"],
};

const levenshteinDistance = (str1 = "", str2 = "") => {
  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));
  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  return track[str2.length][str1.length];
};

const lengthnSubstrings = (sentence, word) => {
  return Object.keys(sentence)
    .map((index) => parseInt(index))
    .flatMap((index) => {
      if (index + word.length < sentence.length) {
        return [
          sentence.substring(index, index + word.length),
          sentence.substring(index, index + word.length + 1),
          sentence.substring(index, index + word.length - 1),
        ];
      } else {
        return [];
      }
    });
};

const containsSimiliarity = (sentence, word, dist = 1) => {
  if (sentence.length <= word.length) {
    return levenshteinDistance(sentence, word) <= dist;
  }
  let substrings = lengthnSubstrings(sentence + " ", word);

  return substrings
    .map((sub) => {
      return levenshteinDistance(sub, word) <= dist;
    })
    .reduce((x, y) => x || y);
};

const containsSimiliarityList = (sentence, wordList, dist = 1) => {
  return wordList
    .map((word) => containsSimiliarity(sentence, word, dist))
    .reduce((x, y) => x || y);
};

const checkSpeechforSim = (sentence, wordList, dist = 1) => {
  if (!Number.isInteger(wordList[0])) {
    let wordMappingList = wordList.map((word) => mappings[word]);
    return wordMappingList.map((mappingList) =>
      containsSimiliarityList(sentence, mappingList, dist)
    );
  }
  wordList = wordList.map((x) => x.toString());
  return wordList.map((x) => containsSimiliarityList(sentence, [x], 0));
};

export default checkSpeechforSim;
