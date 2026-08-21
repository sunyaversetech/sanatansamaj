import { readFileSync } from "fs";
import path from "path";

let logoDataUri: string | null = null;

export function getLogoDataUri() {
  if (logoDataUri) return logoDataUri;
  const bytes = readFileSync(path.join(process.cwd(), "public", "logo.png"));
  logoDataUri = `data:image/png;base64,${bytes.toString("base64")}`;
  return logoDataUri;
}
