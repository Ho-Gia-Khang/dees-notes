import useMediaServiceApi from "@/api/mediaServiceApi";
import type { IFile } from "@/types/document/file";
import { defineStore } from "pinia";
import { ref } from "vue";

const useMediaStore = defineStore("media", () => {
  const mediaApi = useMediaServiceApi();

  const mediaList = ref<IFile[]>([]);
  const isWorking = ref(false);

  async function getMediaListIntermediate() {
    const response = await mediaApi.getMediaList();
    mediaList.value = response.items;
  }

  async function getMediaList() {
    if (isWorking.value) return;
    try {
      isWorking.value = true;
      await getMediaListIntermediate();
    } catch (error) {
      console.error("Error fetching media list:", error);
      throw error;
    } finally {
      isWorking.value = false;
    }
  }

  async function goToPlayer() {
    try {
      const rp = await mediaApi.goToPlayer();
      if (rp.url) {
        window.open(rp.url, "_blank"); // Redirect the user to Jellyfin UI
      }
    } catch (error) {
      console.error("Error when navigate to media player:", error);
      throw error;
    }
  }

  async function deleteFile(fileId: string) {
    if (isWorking.value) return;

    try {
      isWorking.value = true;
      await mediaApi.deleteFile(fileId);
      // Refresh the media list after deletion
      await getMediaListIntermediate();
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    } finally {
      isWorking.value = false;
    }
  }

  async function downloadFile(fileId: string, fileName?: string) {
    if (isWorking.value) return;
    try {
      isWorking.value = true;
      await mediaApi.downloadFile(fileId, fileName);
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    } finally {
      isWorking.value = false;
    }
  }

  return {
    state: {
      mediaList,
      isWorking,
    },
    getMediaList,
    goToPlayer,
    deleteFile,
    downloadFile,
  };
});

export default useMediaStore;
