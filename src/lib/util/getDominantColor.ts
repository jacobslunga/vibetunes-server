import { getColorFromURL } from "color-thief-node";

const getDominantColor = async (url: string) => {
  const color = await getColorFromURL(url);
  const hex = color.map((c: any) => c.toString(16)).join("");
  return `#${hex}`;
};

export default getDominantColor;
