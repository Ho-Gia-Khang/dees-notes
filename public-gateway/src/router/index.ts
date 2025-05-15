import { createRouter, createWebHistory } from "vue-router";
import IndexView from "../views/IndexView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import MediaView from "@/views/mediaView/index.vue";
import MediaPlayer from "@/views/mediaView/player.vue";
import MediaUploader from "@/views/mediaView/uploader.vue";
import DocumentView from "@/views/documentView/index.vue";
import DocumentLibrary from "@/views/documentView/library.vue";
import DocumentEditor from "@/views/documentView/editor.vue";

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
          path: "upload",
          name: "upload",
          component: MediaUploader,
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
          name: "library",
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
