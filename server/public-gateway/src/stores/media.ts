import useMediaServiceApi from "@/api/mediaServiceApi";
import { MEDIA_ROOT_FOLDER_ID } from "@/components/media/constants";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants";
import type { ApiListRequest } from "@/types/shared/common";
import type { IFile, IFolder } from "@/types/shared/files";
import { defineStore } from "pinia";
import { onMounted, ref } from "vue";

const useMediaStore = defineStore("media", () => {
  const mediaApi = useMediaServiceApi();

  const mediaList = ref<IFile[]>([]);
  const foldersList = ref<IFolder[]>([]);
  const isFolderWorking = ref(false);
  const isMediaWorking = ref(false);
  const query = ref<ApiListRequest>({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const totalMedia = ref(0);
  const totalFolders = ref(0);
  const folderId = ref<string | undefined>();

  async function getFoldersListIntermediate() {
    const response = await mediaApi.getFoldersList(query.value);
    foldersList.value = response.items;
    totalFolders.value = response.total;
  }

  async function getMediaListIntermediate(folderId: string) {
    const response = await mediaApi.getMediaList(folderId, query.value);
    mediaList.value = response.items;
    totalMedia.value = response.total;
  }

  async function getFoldersList() {
    if (isFolderWorking.value) return;
    try {
      isFolderWorking.value = true;
      await getFoldersListIntermediate();
    } catch (error) {
      console.error("Error fetching folders list:", error);
      throw error;
    } finally {
      isFolderWorking.value = false;
    }
  }

  async function getMediaList(externalFolderId?: string) {
    if (isMediaWorking.value) return;
    const targetFolder = externalFolderId ?? folderId.value;
    if (!targetFolder) return;
    try {
      isMediaWorking.value = true;
      await getMediaListIntermediate(targetFolder);
    } catch (error) {
      console.error("Error fetching media list:", error);
      throw error;
    } finally {
      isMediaWorking.value = false;
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
    if (isMediaWorking.value || !folderId.value) return;

    try {
      isMediaWorking.value = true;
      await mediaApi.deleteFile(fileId);
      // Refresh the media list after deletion
      await getMediaListIntermediate(folderId.value);
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    } finally {
      isMediaWorking.value = false;
    }
  }

  async function deleteFolder(targetFolderId: string) {
    if (isFolderWorking.value) return;
    if (targetFolderId === MEDIA_ROOT_FOLDER_ID) return;
    try {
      isFolderWorking.value = true;
      await mediaApi.deleteFolder(targetFolderId);
      // Refresh the folder list after deletion
      await getFoldersListIntermediate();
      folderId.value = MEDIA_ROOT_FOLDER_ID;
    } catch (error) {
      console.error("Error deleting folder:", error);
      throw error;
    } finally {
      isFolderWorking.value = false;
    }
  }

  async function downloadFile(fileId: string, fileName?: string) {
    if (isMediaWorking.value) return;
    try {
      isMediaWorking.value = true;
      await mediaApi.downloadFile(fileId, fileName);
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    } finally {
      isMediaWorking.value = false;
    }
  }

  onMounted(getMediaList(MEDIA_ROOT_FOLDER_ID));

  return {
    state: {
      mediaList,
      foldersList,
      isFolderWorking,
      isMediaWorking,
      totalMedia,
      totalFolders,
      query,
    },
    getMediaList,
    goToPlayer,
    deleteFile,
    downloadFile,
    getFoldersList,
    deleteFolder,
  };
});

export default useMediaStore;
