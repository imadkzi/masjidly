<script setup>
import { ref, onErrorCaptured, provide } from "vue";

const error = ref(null);
const errorInfo = ref(null);

onErrorCaptured((err, instance, info) => {
  error.value = err;
  errorInfo.value = info;
  console.error("Error caught by boundary:", err, info);
  // Return false to prevent the error from propagating further
  return false;
});

const clearError = () => {
  error.value = null;
  errorInfo.value = null;
};

provide("errorBoundary", { clearError });
</script>

<template>
  <div v-if="error" class="error-boundary">
    <div class="error-boundary__content">
      <h2 class="error-boundary__title">Something went wrong</h2>
      <p class="error-boundary__message">
        {{ error?.message || "An unexpected error occurred" }}
      </p>
      <button @click="clearError" class="error-boundary__button">
        Try Again
      </button>
      <details class="error-boundary__details" v-if="errorInfo">
        <summary>Technical Details</summary>
        <pre>{{ errorInfo }}</pre>
      </details>
    </div>
  </div>
  <slot v-else />
</template>

<style scoped lang="scss">
@import "../styles/stylesetter";

.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: $padding-large;
  background: rgba(254, 226, 226, 0.1);
  backdrop-filter: blur(10px);
  border-radius: $border-radius;
  border: 1px solid rgba(239, 68, 68, 0.3);

  &__content {
    text-align: center;
    max-width: 600px;
  }

  &__title {
    font-size: $font-size-xlarge;
    font-weight: $font-weight-bold;
    color: #dc2626;
    margin-bottom: $padding-medium;
  }

  &__message {
    font-size: $font-size-medium;
    color: #991b1b;
    margin-bottom: $padding-large;
  }

  &__button {
    padding: $padding-small $padding-medium;
    font-size: $font-size-medium;
    font-weight: $font-weight-bold;
    color: white;
    background-color: #dc2626;
    border: none;
    border-radius: $border-radius;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #b91c1c;
    }

    &:focus {
      outline: 2px solid #dc2626;
      outline-offset: 2px;
    }
  }

  &__details {
    margin-top: $padding-large;
    text-align: left;

    summary {
      cursor: pointer;
      font-weight: $font-weight-bold;
      margin-bottom: $padding-small;
    }

    pre {
      background: rgba(0, 0, 0, 0.1);
      padding: $padding-small;
      border-radius: 4px;
      font-size: $font-size-small;
      overflow-x: auto;
    }
  }
}
</style>
