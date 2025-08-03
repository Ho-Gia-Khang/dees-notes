import useDocumentServiceApi from "@/api/documentServiceApi";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants";
import type { IFile } from "@/types/document/file";
import type { ApiListRequest } from "@/types/shared/common";
import { defineStore } from "pinia";
import { onMounted, ref } from "vue";

const useDocumentStore = defineStore("document", () => {
  const documentApi = useDocumentServiceApi();

  const documentsList = ref<IFile[]>([]);
  const isWorking = ref(false);
  const query = ref<ApiListRequest>({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const total = ref(0);

  async function getDocumentsListIntermediate() {
    const response = await documentApi.getDocumentsList(query.value);
    documentsList.value = response.items;
    total.value = response.total;
  }

  async function getDocumentsList() {
    if (isWorking.value) return;
    try {
      isWorking.value = true;
      await getDocumentsListIntermediate();
    } catch (error) {
      console.error("Error fetching documents list:", error);
      throw error;
    } finally {
      isWorking.value = false;
    }
  }

  async function deleteFile(fileId: string) {
    if (isWorking.value) return;
    try {
      isWorking.value = true;
      await documentApi.deleteFile(fileId);
      // Refresh the documents list after deletion
      await getDocumentsListIntermediate();
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
      await documentApi.downloadFile(fileId, fileName);
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    } finally {
      isWorking.value = false;
    }
  }

  onMounted(getDocumentsList);

  return {
    state: {
      documentsList,
      isWorking,
      query,
      total,
    },
    getDocumentsList,
    deleteFile,
    downloadFile,
  };
});

export default useDocumentStore;
