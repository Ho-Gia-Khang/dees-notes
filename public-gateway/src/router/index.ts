import { createRouter, createWebHistory } from "vue-router";
import IndexView from "../views/IndexView.vue";
import LoginView from "@/views/authView/login.vue";
import MediaView from "@/views/mediaView/index.vue";
import MediaPlayer from "@/views/mediaView/player.vue";
import MediaLibrary from "@/views/mediaView/library.vue";
import DocumentView from "@/views/documentView/index.vue";
import DocumentLibrary from "@/views/documentView/library.vue";
import DocumentEditor from "@/views/documentView/editor.vue";
import AdminView from "@/views/authView/admin/index.vue";
import ProfileView from "@/views/authView/profile.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: IndexView,
    },
    {
      path: "/auth/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/auth/admin",
      name: "admin",
      component: AdminView,
    },
    {
      path: "/auth/profile",
      name: "profile",
      component: ProfileView,
    },
    {
      path: "/media",
      name: "media",
      component: MediaView,
      children: [
        {
          path: "player",
          name: "player",
          component: MediaPlayer,
        },
        {
          path: "library",
          name: "media-library",
          component: MediaLibrary,
        },
      ],
    },
    {
      path: "/documents",
      name: "documents",
      component: DocumentView,
      children: [
        {
          path: "library",
          name: "document-library",
          component: DocumentLibrary,
        },
        {
          path: "editor",
          name: "editor",
          component: DocumentEditor,
        },
      ],
    },
  ],
});

export default router;
