<script setup>
import { computed } from "vue";
import { useRamadanSettings } from "../composables/useRamadanSettings";
import taraweehDuaImageFallback from "../assets/taraweeh-dua.png";

const { settings: ramadanSettings } = useRamadanSettings();
const taraweehDuaImage = computed(
  () => ramadanSettings.value.taraweehDuaImage || taraweehDuaImageFallback
);
</script>

<template>
  <div
    class="taraweeh-dua"
    role="img"
    aria-label="Tasbeeh-e-Taraweeh supplication"
  >
    <img
      :src="taraweehDuaImage"
      alt="Tasbeeh-e-Taraweeh"
      class="taraweeh-dua__image"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "../styles/stylesetter";

.taraweeh-dua {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: var(--color-bg-primary);
  min-height: 0;

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}
</style>
