<script setup>
defineProps({
  isDark: { type: Boolean, required: true },
});

const emit = defineEmits(["toggle"]);
</script>

<template>
  <button
    @click="emit('toggle')"
    class="theme-toggle"
    type="button"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <span class="theme-toggle__icon" aria-hidden="true">
      <svg
        v-if="isDark"
        class="theme-toggle__svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
      <svg
        v-else
        class="theme-toggle__svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </span>
    <span class="theme-toggle__label">{{ isDark ? "Light" : "Dark" }}</span>
  </button>
</template>

<style lang="scss" scoped>
@import "../styles/stylesetter";

.theme-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  padding: 10px 16px;
  border-radius: 9999px;
  border: 1px solid var(--color-panel-border);
  background: var(--color-panel-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px 0 var(--color-panel-shadow);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px 0 var(--color-panel-shadow);
  }

  &:active {
    transform: scale(0.98);
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__svg {
    width: 22px;
    height: 22px;
  }

  &__label {
    white-space: nowrap;
  }

  @media (max-width: $breakpoint-mobile) {
    bottom: 12px;
    right: 12px;
    padding: 8px 12px;
    gap: 6px;
    font-size: 0.85rem;

    .theme-toggle__svg {
      width: 18px;
      height: 18px;
    }
  }
}
</style>
