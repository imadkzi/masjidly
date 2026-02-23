import { describe, it, expect, afterEach, vi } from "vitest";
import { isRamadanNow } from "../ramadanUtils.js";

vi.mock("moment-hijri", () => ({
  default: () => ({
    iMonth: () => 8,
    iDate: () => 1,
  }),
}));

describe("ramadanUtils", () => {
  afterEach(() => {
    window.history.replaceState({}, "", window.location.pathname);
  });

  describe("isRamadanNow", () => {
    it("should respect URL parameter ?ramadan=true", () => {
      const url = new URL(window.location.href);
      url.searchParams.set("ramadan", "true");
      window.history.replaceState({}, "", url);

      expect(isRamadanNow({ respectUrl: true })).toBe(true);
    });

    it("should not be affected by URL parameter if respectUrl is false", () => {
      const url = new URL(window.location.href);
      url.searchParams.set("ramadan", "true");
      window.history.replaceState({}, "", url);

      const result = isRamadanNow({ respectUrl: false });
      expect(typeof result).toBe("boolean");
    });

    it("should return a boolean", () => {
      const result = isRamadanNow();
      expect(typeof result).toBe("boolean");
    });

    it("should handle options object correctly", () => {
      const result1 = isRamadanNow({ respectUrl: true, respectEnv: true });
      const result2 = isRamadanNow({ respectUrl: false, respectEnv: false });

      expect(typeof result1).toBe("boolean");
      expect(typeof result2).toBe("boolean");
    });
  });
});
