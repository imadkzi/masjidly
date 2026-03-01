<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { fetchData, resolveStrapiMediaUrl } from "../utils/apiUtils";
import { isRamadanNow } from "../utils/ramadanUtils";
import {
  SLIDESHOW_DELAY_MS,
  RAMADAN_CHECK_INTERVAL_MS,
} from "../utils/constants";
import { scheduleAtMidnight } from "../utils/scheduleUtils";
import { handleError } from "../utils/errorHandler";
import { useTaraweehDua } from "../composables/useTaraweehDua";
import TaraweehDua from "./TaraweehDua.vue";
import RamadanBanner from "./RamadanBanner.vue";

const ENABLE_SERVER_LOGS = import.meta.env.VITE_ENABLE_SERVER_LOGS === "true";

const { showTaraweehDua } = useTaraweehDua();

const newsItems = ref([]);
const currentBackgroundColor = ref("");
const loading = ref(true);
const error = ref(null);
const isRamadan = ref(false);

let ramadanCheckInterval = null;
let cancelMidnightRefetch = null;

const checkRamadan = () => {
  isRamadan.value = isRamadanNow();
};

async function fetchSlideshow() {
  loading.value = true;
  error.value = null;

  try {
    if (ENABLE_SERVER_LOGS) {
      console.log("[News] fetchSlideshow: starting request");
    }
    const data = await fetchData("/api/announcements?populate=image");

    newsItems.value = (data?.data || [])
      .filter((item) => item.image?.url)
      .map((item) => ({
        image: resolveStrapiMediaUrl(item.image.url),
        title: item.title || "",
        background: item.backgroundColor || "",
      }));
    if (ENABLE_SERVER_LOGS) {
      console.log(
        "[News] fetchSlideshow: success, slides:",
        newsItems.value.length,
      );
    }
  } catch (err) {
    error.value = handleError(
      err,
      "fetchSlideshow",
      "Unable to load announcements",
    );
    console.error("[News] fetchSlideshow error:", err);
  } finally {
    loading.value = false;
  }
}

const onSlideChange = (swiper) => {
  const activeIndex = swiper.realIndex;
  if (newsItems.value[activeIndex]) {
    currentBackgroundColor.value = newsItems.value[activeIndex].background;
  }
};

const swiperConfig = {
  autoplay: {
    delay: SLIDESHOW_DELAY_MS,
    disableOnInteraction: false,
  },
  loop: true,
  slidesPerView: 1,
  modules: [Autoplay],
};

onMounted(() => {
  fetchSlideshow();
  checkRamadan();
  ramadanCheckInterval = setInterval(checkRamadan, RAMADAN_CHECK_INTERVAL_MS);
  cancelMidnightRefetch = scheduleAtMidnight(fetchSlideshow);
});

onUnmounted(() => {
  if (ramadanCheckInterval) {
    clearInterval(ramadanCheckInterval);
    ramadanCheckInterval = null;
  }
  if (cancelMidnightRefetch) {
    cancelMidnightRefetch();
    cancelMidnightRefetch = null;
  }
});
</script>

<template>
  <div
    class="news-container"
    :style="{ backgroundColor: showTaraweehDua ? '' : currentBackgroundColor }"
    role="region"
    aria-label="Announcements and news"
  >
    <TaraweehDua v-if="showTaraweehDua" />
    <template v-else>
      <div
        v-if="loading"
        role="status"
        aria-live="polite"
        aria-label="Loading announcements"
      >
        Loading...
      </div>
      <div v-else-if="error" class="error" role="alert" aria-live="assertive">
        {{ error }}
      </div>
      <div v-else class="news-inner">
        <div class="news-banner">
          <RamadanBanner />
        </div>
        <Swiper
          v-if="newsItems.length"
          :class="{ 'ramadan-news': isRamadan }"
          v-bind="swiperConfig"
          @slideChange="onSlideChange"
          aria-label="Announcements slideshow"
        >
          <SwiperSlide v-for="(item, index) in newsItems" :key="index">
            <div class="news-item">
              <figure class="news-image">
                <img
                  :src="item.image"
                  :alt="item.title || `Announcement ${index + 1}`"
                  :aria-label="item.title || `Announcement ${index + 1}`"
                  loading="lazy"
                />
              </figure>
            </div>
          </SwiperSlide>
        </Swiper>
        <div
          v-else
          :class="{ 'ramadan-news': isRamadan }"
          class="skeleton-news"
          aria-hidden="true"
        >
          <div class="skeleton-image"></div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@import "../styles/stylesetter";

.news-container {
  height: 100%;
  max-height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 0;

  @media (max-width: $breakpoint-mobile) {
    flex: 1;
    min-height: 0;
  }

  .news-inner {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }

  .news-banner {
    flex-shrink: 0;
    padding-bottom: 10px;
  }

  .swiper {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    flex: 1;
    min-height: 0;

    @media (max-width: $breakpoint-mobile) {
      min-height: 0;
    }
  }

  :deep(.swiper-wrapper) {
    height: 100%;
  }

  :deep(.swiper-slide) {
    height: 100%;
    box-sizing: border-box;
  }

  .news-item {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
    min-height: 0;

    figure {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 0;

      img {
        width: 100%;
        height: 100%;
        border-radius: 12px;
        object-fit: cover;
        display: block;
      }
    }
  }
}

.skeleton-news {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  .skeleton-image {
    width: 100%;
    height: 100%;
    background-color: #f0f0f0;
    animation: skeleton-loading 1.5s infinite;
  }
}

@keyframes skeleton-loading {
  0% {
    background-color: #f0f0f0;
  }
  50% {
    background-color: #e0e0e0;
  }
  100% {
    background-color: #f0f0f0;
  }
}

.error {
  color: red;
  text-align: center;
}
</style>
