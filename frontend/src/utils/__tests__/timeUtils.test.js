import { describe, it, expect } from "vitest";
import { time24ToSeconds, secondsUntil, hasTimePassed, formatCountdown } from "../timeUtils.js";

describe("timeUtils", () => {
  describe("time24ToSeconds", () => {
    it("should convert 24-hour time string to seconds", () => {
      expect(time24ToSeconds("00:00")).toBe(0);
      expect(time24ToSeconds("12:00")).toBe(43200);
      expect(time24ToSeconds("23:59")).toBe(86340);
      expect(time24ToSeconds("01:30")).toBe(5400);
    });

    it("should return null for invalid input", () => {
      expect(time24ToSeconds("")).toBeNull();
      expect(time24ToSeconds("invalid")).toBeNull();
      expect(time24ToSeconds("25:00")).toBeNull();
      expect(time24ToSeconds(null)).toBeNull();
      expect(time24ToSeconds(undefined)).toBeNull();
    });
  });

  describe("secondsUntil", () => {
    it("should return seconds until a future time today", () => {
      const now = new Date("2024-01-15T10:00:00");
      const result = secondsUntil("12:00", now);
      
      expect(result).toBe(7200); // 2 hours = 7200 seconds
    });

    it("should handle wrap-around to next day", () => {
      const now = new Date("2024-01-15T23:00:00");
      const result = secondsUntil("01:00", now);
      
      expect(result).toBe(7200); // 2 hours until next day's 01:00
    });

    it("should return null for invalid time", () => {
      expect(secondsUntil("invalid")).toBeNull();
    });
  });

  describe("hasTimePassed", () => {
    it("should return true if time has passed", () => {
      const now = new Date("2024-01-15T12:00:00");
      
      expect(hasTimePassed("11:00", now)).toBe(true);
      expect(hasTimePassed("12:00", now)).toBe(true);
    });

    it("should return false if time has not passed", () => {
      const now = new Date("2024-01-15T12:00:00");
      
      expect(hasTimePassed("13:00", now)).toBe(false);
    });

    it("should return false for invalid time", () => {
      expect(hasTimePassed("invalid")).toBe(false);
    });
  });

  describe("formatCountdown", () => {
    it("should format hours and minutes", () => {
      expect(formatCountdown(3660)).toBe("1h 1m");
      expect(formatCountdown(7200)).toBe("2h 0m");
    });

    it("should format minutes and seconds", () => {
      expect(formatCountdown(125)).toBe("2m 5s");
      expect(formatCountdown(60)).toBe("1m 0s");
    });

    it("should format seconds only", () => {
      expect(formatCountdown(30)).toBe("30s");
      expect(formatCountdown(0)).toBe("0s");
    });
  });
});
