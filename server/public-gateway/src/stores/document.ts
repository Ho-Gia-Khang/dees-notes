import useDocumentServiceApi from "@/api/documentServiceApi";
import type { IFile } from "@/types/document/file";
import { defineStore } from "pinia";
import { onMounted, ref } from "vue";

const useDocumentStore = defineStore("document", () => {
  const documentApi = useDocumentServiceApi();

  const documentsList = ref<IFile[]>([]);
  const isWorking = ref(false);

  async function getDocumentsListIntermediate() {
    const response = await documentApi.getDocumentsList();
    documentsList.value = response.items;
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
    },
    getDocumentsList,
    deleteFile,
    downloadFile,
  };
});

export default useDocumentStore;
