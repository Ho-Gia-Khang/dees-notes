import useDashboardApi from "@/api/dashboardApi";
import { inject, onBeforeMount, provide, ref, type Ref } from "vue";

export interface IDashboardContext {
  state: {
    dashboard: Ref<any | null>;
    isWorking: Ref<boolean>;
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
    },
    getDashboard,
  };

  onBeforeMount(getDashboard);

  provide(DashBoardContextSymbol, context);
  return context;
}
