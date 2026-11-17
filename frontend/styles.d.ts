// Metro loads CSS on web; this tells TypeScript that these imports are valid.
declare module "*.css";

// Expo's web image imports expose the bundled URL and image dimensions.
declare module "*.png" {
  const image: { uri: string; width: number; height: number; toString(): string };
  export default image;
}
declare module "*.webp" {
  const image: { uri: string; width: number; height: number; toString(): string };
  export default image;
}

declare module "*.ttf" {
  const font: { uri: string; toString(): string };
  export default font;
}
