import { options } from "../utils/options.js";

export const getValidOptions = () => {
  return Object.entries(options)
    .map(([cmd, { description }]) => `/${cmd} - ${description}`)
    .join("\n");
};
