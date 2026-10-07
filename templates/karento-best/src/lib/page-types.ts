export interface CapturedPageData {
  title: string;
  head: string;
  body: string;
  bodyAttributes: Record<string, string>;
  scripts: { src?: string; code?: string; type?: string }[];
}
