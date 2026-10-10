import { test } from "node:test";
import assert from "node:assert/strict";
import { shareVehiclePage } from "../src/lib/i18n/share.ts";
import { localizedShareUrl } from "../src/lib/i18n/paths.ts";

test("native Share uses the explicit selected language and exact stock identity", async () => {
  const url = localizedShareUrl(
    new URL("https://dealer.example/variant-6/vehicle?id=real-vehicle"),
    "bg",
    "/variant-6",
  );
  const delivered: { title: string; url: string }[] = [];
  assert.equal(
    await shareVehiclePage(url, "Actual vehicle", {
      share: async (data) => {
        delivered.push(data);
      },
    }),
    "shared",
  );
  assert.deepEqual(delivered, [
    {
      title: "Actual vehicle",
      url: "https://dealer.example/variant-6/vehicle?id=real-vehicle&lang=bg",
    },
  ]);
  const copied: string[] = [];
  assert.equal(
    await shareVehiclePage(url, "Actual vehicle", {
      writeText: async (text) => {
        copied.push(text);
      },
    }),
    "copied",
  );
  assert.deepEqual(copied, [url]);
});

test("unavailable or cancelled sharing never claims that a link was copied", async () => {
  const cancelled = new Error("Cancelled");
  cancelled.name = "AbortError";
  assert.equal(
    await shareVehiclePage("https://dealer.example/", "Dealer", {
      share: async () => {
        throw cancelled;
      },
    }),
    "cancelled",
  );
  assert.equal(
    await shareVehiclePage("https://dealer.example/", "Dealer", {
      writeText: async () => {
        throw new Error("Permission denied");
      },
    }),
    "unavailable",
  );
  assert.equal(
    await shareVehiclePage("https://dealer.example/", "Dealer", {}),
    "unavailable",
  );
});
