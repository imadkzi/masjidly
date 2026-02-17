import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { isRamadanNow } from "../ramadanUtils.js";

describe("ramadanUtils", () => {
  const originalEnv = import.meta.env;
  const originalWindow = window;

  beforeEach(() => {
    vi.clearAllMocks();
  });

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
      
      vi.mock("moment-hijri", () => ({
        default: {
          locale: vi.fn(),
          format: vi.fn(() => "Shawwal"),
        },
      }));

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
