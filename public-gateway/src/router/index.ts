import { createRouter, createWebHistory } from "vue-router";
import IndexView from "../views/IndexView.vue";
import LoginView from "@/views/LoginView.vue";
import MediaView from "@/views/mediaView/index.vue";
import MediaPlayer from "@/views/mediaView/player.vue";
import MediaUploader from "@/views/mediaView/uploader.vue";
import DocumentView from "@/views/documentView/index.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: IndexView,
    },
    {
      path: "/login",
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
    },
  ],
});

export default router;
