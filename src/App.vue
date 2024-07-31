<script setup lang="ts">
import { ref } from 'vue';
import usePlexStore from '@/stores/plex';

const plexStore = usePlexStore();

const movies = ref<any[]>([]);
const currentCount = ref<number>(-1);
const runningTimer = ref<boolean>(false);
const selectedMovie = ref<any>(null);

async function getRandomMovies() {
  runningTimer.value = false;
  currentCount.value = -1;
  selectedMovie.value = null;
  movies.value = await plexStore.getRandomMovies(15);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  startTimer();
}

async function startTimer() {
  if (runningTimer.value) return;
  runningTimer.value = true;

  while (runningTimer.value) {
    for (let i = 0; i < 3; i++) {
      currentCount.value = Math.floor(Math.random() * movies.value.length);

      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
}
async function stopTimer() {
  runningTimer.value = false;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  selectedMovie.value = movies.value[currentCount.value];
}

function formatDuration(milliseconds: number) {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
</script>

<template>
  <main class="tw_flex tw_justify-center">
    <div class="tw_text-center tw_max-w-full tw_w-[600px] tw_mt-4 tw_p-4">
      <button class="tw_border-2 tw_px-4 tw_py-2 tw_rounded tw_text-lg" @click="getRandomMovies">
        Get Random Movies
      </button>

      <div v-if="movies.length > 0">
        <hr class="tw_my-4" />

        <transition name="grow">
          <div v-if="selectedMovie" class="tw_mb-4 tw_px-1 tw_flex tw_items-start tw_gap-4">
            <img :src="selectedMovie.poster" class="tw_w-1/3 tw_h-auto tw_rounded" />

            <div class="tw_text-left tw_w-2/3 tw_py-2">
              <p class="tw_font-bold tw_text-xl">{{ selectedMovie.title }}</p>
              <p class="tw_text-gray-500 tw_text-sm tw_mb-2">
                Directed by {{ selectedMovie.director }}
              </p>

              <div class="tw_flex tw_gap-4 tw_text-base tw_text-gray-500">
                <p>{{ selectedMovie.year }}</p>
                <p>{{ formatDuration(selectedMovie.duration) }}</p>
              </div>

              <p class="tw_text-base tw_mt-2 tw_line-clamp-5">{{ selectedMovie.summary }}</p>

              <a
                :href="selectedMovie.url"
                target="_blank"
                class="tw_mt-2 tw_block tw_text-base tw_text-blue-600 tw_underline hover:tw_text-blue-400 tw_transition-colors"
              >
                View Movie
              </a>
            </div>
          </div>
        </transition>

        <div v-if="!selectedMovie" class="tw_flex tw_gap-2 tw_justify-center tw_mb-4">
          <button class="tw_border-2 tw_px-4 tw_py-2 tw_rounded" @click="stopTimer">Stop</button>
        </div>

        <div class="tw_flex tw_justify-center tw_flex-wrap">
          <div
            v-for="(movie, i) in movies"
            :key="i"
            class="tw_w-1/5 tw_p-1 tw_transition-all tw_duration-150"
            :class="{
              'tw_scale-110': currentCount === i,
            }"
          >
            <div class="tw_rounded tw_overflow-hidden tw_aspect-[2/3]">
              <img
                :src="movie.poster"
                class="tw_w-full tw_h-full tw_object-cover tw_transition-all tw_duration-150"
                :class="{
                  'tw_blur-[6px]': currentCount !== i,
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.grow-enter-active,
.grow-leave-active {
  transition: height 0.5s ease;
}
.grow-enter,
.grow-leave-to {
  height: 0;
  overflow: hidden;
}
</style>
