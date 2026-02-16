import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getWeekRange, getTomorrowISO } from "../dateUtils.js";

describe("dateUtils", () => {
  describe("getWeekRange", () => {
    it("should return ISO date strings for start and end of week", () => {
      const result = getWeekRange();
      
      expect(result).toHaveProperty("startISO");
      expect(result).toHaveProperty("endISO");
      expect(result.startISO).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(result.endISO).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should return dates 7 days apart", () => {
      const { startISO, endISO } = getWeekRange();
      const start = new Date(startISO);
      const end = new Date(endISO);
      const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
      
      expect(diffDays).toBe(6); // 6 days between start and end (inclusive)
    });

    it("should start on Sunday", () => {
      const { startISO } = getWeekRange();
      const start = new Date(startISO);
      
      expect(start.getDay()).toBe(0); // 0 = Sunday
    });
  });

  describe("getTomorrowISO", () => {
    it("should return tomorrow's date in ISO format", () => {
      const result = getTomorrowISO();
      
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should return a date one day after today", () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const expectedISO = tomorrow.toISOString().split("T")[0];
      
      const result = getTomorrowISO();
      
      expect(result).toBe(expectedISO);
    });

    it("should handle month/year boundaries correctly", () => {
      // Mock a date at the end of a month
      const mockDate = new Date("2024-01-31");
      vi.useFakeTimers();
      vi.setSystemTime(mockDate);
      
      const result = getTomorrowISO();
      const expected = "2024-02-01";
      
      expect(result).toBe(expected);
      
      vi.useRealTimers();
    });
  });
});
