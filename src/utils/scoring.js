const computeScore = (aiSkills, posteDescription) => {
  if(!posteDescription || !aiSkills) return 0;

  const desc = posteDescription.toLowerCase();

  let score = 0;
  aiSkills.forEach(skill => {
    if( desc.includes(skill.toLowerCase())) {
      score += 15; //chaque skill match = +15
    }
  });

  // Bonus si beaucoup de skills
  if(aiSkills.length >= 5) score += 10;
  // Max 100
  return Math.min(score, 100);
};

module.exports = { computeScore };
