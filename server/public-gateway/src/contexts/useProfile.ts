import useUserApi from "@/api/userApi";
import { LOGIN_ROUTE } from "@/constants";
import type { IUser } from "@/types/auth/User";
import { inject, onMounted, ref, type Ref } from "vue";
import { useRouter } from "vue-router";

interface IProfileContext {
  state: {
    profile: Ref<IUser | null>;
    isLoading: Ref<boolean>;
  };
  getProfile: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateProfile: (phoneNumber?: string, password?: string) => Promise<any>;
}

const ProfileContextSymbol = Symbol("ProfileContext");
export default function useProfile(): IProfileContext {
  return inject(ProfileContextSymbol) as IProfileContext;
}

export function provideProfile() {
  const router = useRouter();

  const userApi = useUserApi();

  const profile = ref<IUser | null>(null);
  const isLoading = ref<boolean>(false);

  async function getProfile() {
    if (isLoading.value) return;

    try {
      isLoading.value = true;
      const rp = await userApi.getProfile();
      profile.value = rp;
    } catch (error) {
      console.error("Error fetching profile:", error);
      profile.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateProfile(phoneNumber?: string, password?: string) {
    if (isLoading.value || !profile.value) return;

    try {
      isLoading.value = true;
      await userApi.update(phoneNumber, password);
      profile.value.phoneNumber = phoneNumber || profile.value.phoneNumber;
    } catch (err) {
      console.error;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteAccount() {
    if (isLoading.value || !profile.value) return;

    try {
      isLoading.value = true;
      await userApi.deleteAccount();
      profile.value = null; // Clear profile after deletion
      router.replace(LOGIN_ROUTE); // Redirect to login page
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      isLoading.value = false;
    }
  }

  onMounted(getProfile);

  const context: IProfileContext = {
    state: {
      profile,
      isLoading,
    },
    getProfile,
    deleteAccount,
    updateProfile,
  };

  return context;
}
