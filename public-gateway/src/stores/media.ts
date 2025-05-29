import useMediaServiceApi from "@/api/mediaServiceApi";
import { defineStore } from "pinia";
import { ref } from "vue";

const useMediaStore = defineStore("media", () => {
  const mediaApi = useMediaServiceApi();

  const mediaList = ref([]);

  async function getMediaList() {
    try {
      const response = await mediaApi.getMediaList();
      // mediaList.value = response.data;
    } catch (error) {
      console.error("Error fetching media list:", error);
      throw error;
    }
  }

  async function goToPlayer() {
    try {
      const rp = await mediaApi.goToPlayer();
      if (rp.url) {
        // window.location.href = rp.url; // Redirect the user to Jellyfin UI
        window.open(rp.url, "_blank"); // Redirect the user to Jellyfin UI
      }
      // mediaList.value = response.data;
    } catch (error) {
      console.error("Error when navigate to media player:", error);
      throw error;
    }
  }

  return {
    state: {
      mediaList,
    },
    getMediaList,
    goToPlayer,
  };
});

export default useMediaStore;
