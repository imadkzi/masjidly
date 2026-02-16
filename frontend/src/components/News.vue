<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { fetchData } from "../utils/apiUtils";
import { isRamadanNow } from "../utils/ramadanUtils";
import { SLIDESHOW_DELAY_MS, RAMADAN_CHECK_INTERVAL_MS } from "../utils/constants";
import { handleError } from "../utils/errorHandler";

const newsItems = ref([]);
const currentBackgroundColor = ref("");
const loading = ref(true);
const error = ref(null);
const isRamadan = ref(false);

let ramadanCheckInterval = null;

const checkRamadan = () => {
  isRamadan.value = isRamadanNow();
};

async function fetchSlideshow() {
  loading.value = true;
  error.value = null;

  try {
    const data = await fetchData("/api/announcements?populate=image");

    newsItems.value = (data?.data || [])
      .filter((item) => item.image?.url) // Only include items with images
      .map((item) => ({
        image: item.image.url, // Cloudinary URL from Strapi
        title: item.title || "",
        background: item.backgroundColor || "",
      }));
  } catch (err) {
            error.value = handleError(err, "fetchSlideshow", "Unable to load announcements");
    console.error("Error fetching slideshow data:", err);
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
  checkRamadan(); // Initial check
  ramadanCheckInterval = setInterval(checkRamadan, RAMADAN_CHECK_INTERVAL_MS);
});

onUnmounted(() => {
  if (ramadanCheckInterval) {
    clearInterval(ramadanCheckInterval);
    ramadanCheckInterval = null;
  }
});
</script>

<template>
  <div
    class="news-container"
    :style="{ backgroundColor: currentBackgroundColor }"
    role="region"
    aria-label="Announcements and news"
  >
    <div v-if="loading" role="status" aria-live="polite" aria-label="Loading announcements">Loading...</div>
    <div v-if="error" class="error" role="alert" aria-live="assertive">{{ error }}</div>
    <Swiper
      :class="{ 'ramadan-news': isRamadan }"
      v-else-if="newsItems.length"
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
    <div v-else :class="{ 'ramadan-news': isRamadan }" class="skeleton-news" aria-hidden="true">
      <div class="skeleton-image"></div>
    </div>
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

  .swiper {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
  }

  :deep(.swiper-wrapper) {
    height: 100%;
  }

  :deep(.swiper-slide) {
    height: 100%;
  }

  .news-item {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;

    figure {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 100%;
        height: 100%;
        border-radius: 12px;
        object-fit: cover;
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
