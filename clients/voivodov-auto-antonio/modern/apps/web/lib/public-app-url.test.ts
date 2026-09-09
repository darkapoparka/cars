import { describe, expect, it } from "vitest";
import { getPublicAppBaseUrl, getPublicAppUrl } from "./public-app-url";

describe("VOIVODOV AUTO & ANTONIO companion app URLs", () => {
  it("normalizes an explicitly configured HTTP origin", () => {
    expect(
      getPublicAppUrl("/saved", "https://day-night-app.example/workspace/")
    ).toBe("https://day-night-app.example/saved");
  });

  it("falls back locally when a configured value is malformed", () => {
    expect(getPublicAppUrl("/sell/new", "not-a-url")).toBe(
      "http://localhost:3000/sell/new"
    );
    expect(getPublicAppBaseUrl("not-a-url")).toBe("http://localhost:3000");
  });
});
