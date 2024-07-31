import { defineStore } from 'pinia';
import axios from 'axios';

const env = import.meta.env;

export default defineStore({
  id: 'plex',

  state: () => ({}),

  getters: {},

  actions: {
    async getRandomMovies(movieCount: number) {
      try {
        const response = await axios.get(`${env.VITE_PLEX_URL}/library/sections/1/all`, {
          headers: {
            'X-Plex-Token': env.VITE_PLEX_TOKEN,
            'X-Plex-Container-Start': 0,
            'X-Plex-Container-Size': movieCount,
          },
          params: {
            sort: 'random',
          },
        });

        const movies = response.data.MediaContainer.Metadata.map((movie) => ({
          title: movie.title,
          year: movie.year,
          director: movie.Director?.map((dir) => dir.tag).join(', ') || 'Unknown',
          duration: movie.duration,
          summary: movie.summary,
          poster: `${env.VITE_PLEX_URL}${movie.thumb}?X-Plex-Token=${env.VITE_PLEX_TOKEN}`,
          url: `${env.VITE_PLEX_URL}/web/index.html#!/server/${env.VITE_PLEX_SERVER_ID}/details?key=%2Flibrary%2Fmetadata%2F${movie.ratingKey}`,
        }));

        return movies;
      } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
      }
    },
  },
});
