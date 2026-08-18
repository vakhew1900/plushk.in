export const Mode = {
  ON: "on",
  OFF: "off",
} as const;

export type Mode = (typeof Mode)[keyof typeof Mode];
