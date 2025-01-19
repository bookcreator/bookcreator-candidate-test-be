import { createCanvas } from "canvas";

export const createColorWheel = (colors, radius) => {
  const canvas = createCanvas(radius * 2, radius * 2);
  const ctx = canvas.getContext("2d");

  // Center of the color wheel
  const centerX = radius;
  const centerY = radius;

  // Start angle for drawing arcs
  let startAngle = 0;

  colors.forEach((color) => {
    // Calculate the end angle based on the percentage
    const endAngle = startAngle + 2 * Math.PI * (color.percentage / 100);

    // Convert RGB to CSS color string
    const colorString = `rgb(${color.r}, ${color.g}, ${color.b})`;

    // Draw the arc segment
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = colorString;
    ctx.fill();

    // Update the start angle for the next segment
    startAngle = endAngle;
  });

  return canvas.toBuffer('image/png')
};
