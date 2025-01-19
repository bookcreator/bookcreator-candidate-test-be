import { formatDominantColours } from "./formatDominantColours";

const inputFormat = [
  {
    color: {
      red: 251,
      green: 115,
      blue: 2,
      alpha: null,
    },
    score: 0.3698621094226837,
    pixelFraction: 0.161259263753891,
  },
  {
    color: {
      red: 253,
      green: 174,
      blue: 1,
      alpha: null,
    },
    score: 0.1307705044746399,
    pixelFraction: 0.04118518531322479,
  },
  {
    color: {
      red: 0,
      green: 174,
      blue: 0,
      alpha: null,
    },
    score: 0.1307705044746399,
    pixelFraction: 0.02118518531322479,
  },
  {
    color: {
      red: 10,
      green: 174,
      blue: 3,
      alpha: null,
    },
    score: 0.1307705044746399,
    pixelFraction: 0.06118518531322479,
  },
];

describe(`${formatDominantColours.name}`, () => {
  it("converts from gcloud format to more human readable format", () => {
    const output = formatDominantColours(inputFormat);
    expect(output).toEqual([
      { r: 251, g: 115, b: 2, percentage: 56.618986303939934 },
      { r: 10, g: 174, b: 3, percentage: 21.482444410390737 },
      { r: 253, g: 174, b: 1, percentage: 14.46033789868669 },
      { r: 0, g: 174, b: 0, percentage: 7.438231386982638 },
    ]);
  });
  it("removes the lowest percentage colour if the number of colours is 3", () => {
    const output = formatDominantColours(inputFormat, 3);
    expect(output).toEqual([
      { r: 251, g: 115, b: 2, percentage: 61.168868262071385 },
      { r: 10, g: 174, b: 3, percentage: 23.208766137782685 },
      { r: 253, g: 174, b: 1, percentage: 15.62236560014592 },
    ]);
  });
});
