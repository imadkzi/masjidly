<script setup>
import taraweehDuaImage from "../assets/taraweeh-dua.png";
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
    object-fit: contain;
    display: block;
  }
}
</style>
