export const Mode = {
  AUTO: "auto",
  HINT: "hint",
  OFF: "off",
} as const;

export type Mode = (typeof Mode)[keyof typeof Mode];
