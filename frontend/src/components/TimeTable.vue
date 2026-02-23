<script setup>
import { computed } from "vue";
import { PRAYER_NAMES } from "../utils/constants.js";

const props = defineProps({
  prayers: { type: Array, default: () => [] },
  activeName: { type: String, default: "" },
  tomorrowData: { type: Array, default: () => [] },
  showDayLabels: { type: Boolean, default: true },
});

const normalizeName = (name) => (name || "").toString().trim().toLowerCase();

const normalizedActiveName = computed(() => normalizeName(props.activeName));

const isActive = (rowName) =>
  normalizedActiveName.value &&
  normalizeName(rowName) === normalizedActiveName.value;
</script>

<template>
  <div
    class="timetable-container"
    :class="{ 'timetable-container--day-labels': props.showDayLabels }"
    role="region"
    aria-label="Prayer times timetable"
  >
    <div v-if="prayers.length" class="timetable">
      <div class="timetable__header" role="row">
        <span
          class="name-column"
          role="columnheader"
          aria-label="Prayer name"
        ></span>
        <span class="time-column" role="columnheader" aria-label="Start time"
          >Start</span
        >
        <span class="time-column" role="columnheader" aria-label="Jamat time"
          >Jamat</span
        >
      </div>
      <ul class="timetable__list" role="list">
        <li
          v-for="(row, index) in prayers"
          :key="index"
          :class="{
            jummah: row.name === PRAYER_NAMES.JUMMAH,
            active: isActive(row.name),
          }"
          role="listitem"
          :aria-label="`${row.name === PRAYER_NAMES.JUMMAH ? 'Jummah' : row.name}${props.showDayLabels && row.name !== PRAYER_NAMES.JUMMAH ? ` ${row.dayLabel || 'Today'}` : ''} prayer: Start ${row.startTime12}${row.jamatTime12 ? `, Jamat ${row.jamatTime12}` : ''}`"
          :aria-current="isActive(row.name) ? 'true' : undefined"
        >
          <span class="name-column">{{ row.name === PRAYER_NAMES.JUMMAH ? 'Jummah' : row.name }}{{ props.showDayLabels && row.name !== PRAYER_NAMES.JUMMAH ? ` ${row.dayLabel || 'Today'}` : '' }}</span>

          <template v-if="row.startTime12 && !row.jamatTime12">
            <time
              class="time-column full-width"
              :datetime="row.startTime24"
              aria-label="Start time"
              >{{ row.startTime12 }}</time
            >
          </template>

          <template
            v-else-if="row.startTime12 === row.jamatTime12 && row.startTime12"
          >
            <time
              class="time-column full-width"
              :datetime="row.startTime24"
              aria-label="Prayer time"
              >{{ row.startTime12 }}</time
            >
          </template>

          <template v-else>
            <time
              class="time-column"
              :datetime="row.startTime24"
              aria-label="Start time"
              >{{ row.startTime12 }}</time
            >
            <time
              class="time-column"
              :datetime="row.jamatTime24"
              aria-label="Jamat time"
              >{{ row.jamatTime12 }}</time
            >
          </template>
        </li>
      </ul>
    </div>
    <div v-else class="no-data" role="status" aria-live="polite">
      <p>No data found for this week or today.</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../styles/stylesetter";

.timetable-container {
  width: 100%;
  min-width: 0;
  height: 100%;
  overflow: hidden;

  @media (max-width: $breakpoint-mobile) {
    height: auto;
  }

  .timetable {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
    flex-grow: 1;
    height: 100%;

    @media (max-width: $breakpoint-mobile) {
      height: auto;
      flex-grow: 0;
    }

    &__header {
      display: flex;
      padding: 10px 4px 14px;
      color: var(--color-text-secondary);
      font-size: $font-size-large;
      font-weight: $font-weight-bold;
      text-transform: none;
      margin-bottom: 6px;

      .name-column {
        width: 40%;
        text-align: left;
      }
      .time-column {
        flex: 1;
        text-align: center;
      }

      @media (max-width: $breakpoint-mobile) {
        padding: 8px 6px 10px;
        font-size: 0.95rem;
        margin-bottom: 8px;
      }
    }

    &__list {
      display: flex;
      flex-direction: column;
      list-style: none;
      padding: 0;
      margin: 0;
      flex-grow: 1;
      min-width: 0;
      gap: 12px;
      justify-content: space-between;

      @media (max-width: $breakpoint-mobile) {
        flex-grow: 0;
        justify-content: flex-start;
        gap: 10px;
      }

      li {
        display: flex;
        align-items: center;
        min-width: 0;
        padding: 15px 20px;
        font-size: 2.4rem;
        line-height: 1.25;
        font-variant-numeric: tabular-nums;
        background: var(--color-madni-row-bg);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-radius: 12px;
        border: 1px solid var(--color-madni-row-border);
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;

        @media (max-width: $breakpoint-tablet) {
          padding: 12px 16px;
          font-size: 2rem;
        }

        @media (max-width: $breakpoint-mobile) {
          padding: 14px 16px;
          font-size: 1.25rem;
          line-height: 1.35;
          border-radius: 10px;
        }

        &:hover {
          background: var(--color-madni-row-bg);
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.12);
        }

        &.jummah {
          color: var(--color-jummah-text);
          background: var(--color-jummah-bg);
          border: 1px solid var(--color-jummah-border);
        }

        &.active {
          background: var(--color-active-bg);
          border: 2px solid var(--color-active-border);
          box-shadow:
            0 0 28px 0 var(--color-active-glow),
            0 2px 8px 0 rgba(0, 0, 0, 0.12);
        }

        .name-column {
          width: 40%;
          min-width: 0;
          font-weight: $font-weight-bold;
          color: var(--color-text-primary);
          overflow: visible;
          white-space: nowrap;
          font-size: 2.4rem;

          @media (max-width: 1440px) {
            font-size: 2.15rem;
          }

          @media (max-width: $breakpoint-tablet) {
            font-size: 2rem;
          }

          @media (max-width: $breakpoint-mobile) {
            font-size: 1.5rem;
          }
        }

        .time-column {
          flex: 1;
          min-width: 0;
          text-align: center;
          color: var(--color-text-primary);
          font-weight: $font-weight-extra-bold;
          font-size: 2.4rem;

          @media (max-width: 1440px) {
            font-size: 2.15rem;
          }

          @media (max-width: $breakpoint-tablet) {
            font-size: 2rem;
          }

          @media (max-width: $breakpoint-mobile) {
            font-size: 1.5rem;
          }

          &.full-width {
            flex: 2;
          }
        }
      }
    }
  }

  &.timetable-container--day-labels .timetable .timetable__list li .name-column,
  &.timetable-container--day-labels .timetable .timetable__list li .time-column {
    font-size: 2rem;

    @media (max-width: 1440px) {
      font-size: 1.75rem;
    }

    @media (max-width: $breakpoint-tablet) {
      font-size: 1.7rem;
    }

    @media (max-width: $breakpoint-mobile) {
      font-size: 1.2rem;
    }
  }

  .no-data {
    text-align: center;
    padding: 30px;
    font-size: 1.4rem;
    color: $color-secondary;
  }
}
</style>
