export type BearerResult = `Bearer ${string}`;
export const Bearer = (str: string): BearerResult => {
  return `Bearer ${str}`;
};
