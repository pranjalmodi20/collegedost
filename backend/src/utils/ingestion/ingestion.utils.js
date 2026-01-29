const stringSimilarity = require('string-similarity');

const normalizeString = (str) => {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // remove special chars
    .replace(/\s+/g, ' ') // collapse spaces
    .trim();
};

/**
 * Finds the best match for a college name from a list of candidates.
 * @param {String} targetName - Name to find
 * @param {Array} candidates - Array of objects { name, _id, aliases }
 * @param {Number} threshold - Minimum score (0-1) to consider a match
 */
const findBestMatch = (targetName, candidates, threshold = 0.8) => {
  if (!candidates || candidates.length === 0) return null;

  const normalizedTarget = normalizeString(targetName);
  
  // Create a map of name -> candidate
  const nameMap = {};
  const names = [];

  candidates.forEach(c => {
    // Check main name
    const nName = normalizeString(c.name);
    if (nName) {
      names.push(nName);
      nameMap[nName] = c;
    }
    // Check aliases
    if (c.aliases && Array.isArray(c.aliases)) {
      c.aliases.forEach(alias => {
        const nAlias = normalizeString(alias);
        if (nAlias) {
          names.push(nAlias);
          nameMap[nAlias] = c; // Maps alias to the same college object
        }
      });
    }
  });

  const matches = stringSimilarity.findBestMatch(normalizedTarget, names);
  const best = matches.bestMatch;

  if (best.rating >= threshold) {
    return {
      college: nameMap[best.target],
      score: best.rating,
      matchedName: best.target
    };
  }

  return null;
};

module.exports = {
  normalizeString,
  findBestMatch
};
