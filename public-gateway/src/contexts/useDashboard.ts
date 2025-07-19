import useDashboardApi from "@/api/dashboardApi";
import { inject, onBeforeMount, provide, ref, type Ref } from "vue";

export interface IDashboardContext {
  state: {
    dashboard: Ref<any | null>;
    isWorking: Ref<boolean>;
    videoCount: Ref<number>;
    imageCount: Ref<number>;
    documentCount: Ref<number>;
    totalStorage: Ref<number>; // Optional, if storage data is included
    usedStorage: Ref<number>; // Optional, if storage data is included
    freeStorage: Ref<number>; // Optional, if storage data is included
  };
  getDashboard: () => Promise<any>;
}

const DashBoardContextSymbol = Symbol("DashBoardContext");

export default function useDashboard() {
  return inject(DashBoardContextSymbol) as IDashboardContext;
}

export function provideDashboard() {
  const dashboardApi = useDashboardApi();

  const dashboard = ref<any>(null);
  const isWorking = ref<boolean>(false);
  const videoCount = ref<number>(1);
  const imageCount = ref<number>(1);
  const documentCount = ref<number>(1);
  const totalStorage = ref<number>(256); // Example total storage in GB
  const usedStorage = ref<number>(0.93); // Example used storage in GB
  const freeStorage = ref<number>(255.07); // Example free storage in GB

  async function getDashboard() {
    try {
      isWorking.value = true;
      const response = await dashboardApi.getDashboard();
      console.log("Dashboard response:", response);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      isWorking.value = false;
    }
  }

  const context: IDashboardContext = {
    state: {
      dashboard,
      isWorking,
      videoCount,
      imageCount,
      documentCount,
      totalStorage,
      usedStorage,
      freeStorage,
    },
    getDashboard,
  };

  onBeforeMount(getDashboard);

  provide(DashBoardContextSymbol, context);
  return context;
}
