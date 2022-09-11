export const transformBoolean = (k: string, v: string) =>
  v === "true" ? true : v === "false" ? false : v;
