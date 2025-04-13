import useMediaServiceApi from "@/api/mediaServiceApi";
import { defineStore } from "pinia";
import { ref } from "vue";

const useMediaStore = defineStore("media", () => {
  const mediaApi = useMediaServiceApi();

  const mediaList = ref([]);

  async function getMediaList() {
    try {
      const response = await mediaApi.getMediaList();
      console.log(" response:", response);
      // mediaList.value = response.data;
    } catch (error) {
      console.error("Error fetching media list:", error);
      throw error;
    }
  }

  async function gotoPlayer() {
    try {
      await mediaApi.gotoPlayer();
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
    gotoPlayer,
  };
});

export default useMediaStore;
