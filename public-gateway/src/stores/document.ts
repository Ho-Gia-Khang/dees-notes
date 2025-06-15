import useDocumentServiceApi from "@/api/documentServiceApi";
import { defineStore } from "pinia";
import { onMounted, ref } from "vue";

const useDocumentStore = defineStore("document", () => {
  const documentApi = useDocumentServiceApi();

  const documentsList = ref<any[]>([]);
  const isWorking = ref(false);

  async function getDocumentsListIntermediate() {
    const response = await documentApi.getDocumentsList();
    documentsList.value = response.data;
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

  onMounted(getDocumentsList);

  return {
    state: {
      documentsList,
      isWorking,
    },
    getDocumentsList,
  };
});

export default useDocumentStore;
