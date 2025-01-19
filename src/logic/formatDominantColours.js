export const formatDominantColours = (dominantColours, numberOfColors = 5) => {
  const topColors = dominantColours
    .sort((a, b) => b.pixelFraction - a.pixelFraction)
    .slice(0, numberOfColors);

  const totalPixelFraction = topColors.reduce(
    (total, { pixelFraction }) => (total += pixelFraction),
    0,
  );

  return topColors.map((properties) => ({
    r: properties.color.red,
    g: properties.color.green,
    b: properties.color.blue,
    percentage: (properties.pixelFraction / totalPixelFraction) * 100,
  }));
};
