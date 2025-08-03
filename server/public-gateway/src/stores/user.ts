import useUserApi from "@/api/userApi";
import type { IUser } from "@/types/auth/User";
import { defineStore } from "pinia";
import { ref } from "vue";

const useUserStore = defineStore("userStore", () => {
  const userApi = useUserApi();

  const usersList = ref<IUser[]>([]);
  const totalUsers = ref<number>(0);
  const isWorking = ref<boolean>(false);

  async function fetchUsersListIntermediate() {
    const users = await userApi.getUsersList();
    usersList.value = users.items;
    totalUsers.value = users.total;
  }

  async function fetchUsersList() {
    try {
      if (isWorking.value) return;

      isWorking.value = true;
      await fetchUsersListIntermediate();
    } catch (error) {
      usersList.value = [];
      totalUsers.value = 0;
      console.error("Failed to fetch users list:", error);
      throw error;
    } finally {
      isWorking.value = false;
    }
  }

  async function createUser(
    phoneNumber: string,
    userName: string,
    password: string,
    confirmPassword: string,
  ) {
    try {
      if (isWorking.value) return;

      isWorking.value = true;

      await userApi.create(phoneNumber, userName, password, confirmPassword);
      await fetchUsersListIntermediate(); // Refresh the users list after creating a new user
    } catch (error) {
      console.error("User creation failed:", error);
      throw error;
    } finally {
      isWorking.value = false;
    }
  }

  async function deleteMemberAccount(phoneNumber: string) {
    try {
      if (isWorking.value) return;

      isWorking.value = true;
      await userApi.deleteMemberAccount(phoneNumber);
      await fetchUsersListIntermediate(); // Refresh the users list after deletion
    } catch (error) {
      console.error("Member account deletion failed:", error);
      throw error;
    } finally {
      isWorking.value = false;
    }
  }

  return {
    state: {
      usersList,
      totalUsers,
      isWorking,
    },
    fetchUsersList,
    createUser,
    deleteMemberAccount,
  };
});

export default useUserStore;
