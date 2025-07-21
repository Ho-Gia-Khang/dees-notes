<template>
  <nav class="nav">
    <RouterLink v-if="HOME_NAV_ITEM.to" :to="HOME_NAV_ITEM.to" class="home-nav-item">
      <Icon :icon="HOME_NAV_ITEM.icon" :size="28" />
      <span v-if="isLevel1Active">{{ HOME_NAV_ITEM.label }}</span>
    </RouterLink>

    <div class="nav-item-wrapper wrapper-level-1" :class="{ 'nav-inactive': !isLevel1Active }">
      <div v-for="item in NAV_ITEMS" :key="item.label">
        <RouterLink
          :to="item.to"
          class="nav-item"
          :class="{ active: currentSelectNavItem?.to === item.to }"
          @click="isLevel2Active = true"
        >
          <Icon :icon="item.icon" />
          <span v-if="isLevel1Active" :class="`level-${item.level}`">{{ item.label }}</span>
        </RouterLink>
      </div>

      <ElButton
        :icon="isLevel1Active ? CaretLeft : CaretRight"
        circle
        class="toggle-btn"
        @click="isLevel1Active = !isLevel1Active"
      />
    </div>

    <div
      v-if="currentSelectNavItem"
      class="nav-item-wrapper wrapper-level-2"
      :class="{ 'nav-inactive': !isLevel2Active }"
    >
      <div v-for="item in currentSelectNavItem.children" :key="item.label">
        <RouterLink :to="item.to" class="nav-item" :class="{ active: currentRoute === item.to }">
          <Icon :icon="item.icon" />
          <span v-if="isLevel2Active" :class="`level-${item.level}`">{{ item.label }}</span>
        </RouterLink>

        <ElButton
          :icon="isLevel2Active ? CaretLeft : CaretRight"
          circle
          class="toggle-btn"
          @click="isLevel2Active = !isLevel2Active"
        />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ENavLevel, type INavItem } from "@/types/main/navItem";
import { RouterLink, useRouter } from "vue-router";
import Icon from "../shared/icon.vue";
import { computed, ref } from "vue";
import { ElButton } from "element-plus";
import { CaretLeft, CaretRight } from "@element-plus/icons-vue";

const router = useRouter();

const HOME_NAV_ITEM: INavItem = {
  label: "DeesNotes",
  to: "/",
  level: ENavLevel.LEVEL_1,
  icon: "home",
};

const NAV_ITEMS: INavItem[] = [
  {
    label: "Media",
    level: ENavLevel.LEVEL_1,
    icon: "media",
    to: "/media",
    children: [
      {
        label: "Player",
        to: "/media/player",
        level: ENavLevel.LEVEL_2,
        icon: "player",
      },
      {
        label: "Library",
        to: "/media/library",
        level: ENavLevel.LEVEL_2,
        icon: "library",
      },
    ],
  },
  {
    label: "Documents",
    to: "/documents",
    level: ENavLevel.LEVEL_1,
    icon: "document",
    children: [
      {
        label: "Library",
        to: "/documents/library",
        level: ENavLevel.LEVEL_2,
        icon: "library",
      },
      {
        label: "Editor",
        to: "/documents/editor",
        level: ENavLevel.LEVEL_2,
        icon: "editor",
      },
    ],
  },
];

const isLevel1Active = ref(true);
const isLevel2Active = ref(false);

const currentRoute = computed(() => router.currentRoute.value.path);

const currentSelectNavItem = computed<INavItem | undefined>(() => {
  const routeParts = currentRoute.value.split("/");
  // if no route is selected
  const isRouteSelected = routeParts[1] !== "";
  if (!isRouteSelected) return undefined;

  // the route parts should have 3 elem, the first one is an empty string, second one is the service, and the third one is the page
  const selectedNavItem = NAV_ITEMS.find((item) => item.to.includes(routeParts[1]));
  return selectedNavItem;
});
</script>

<style lang="scss" scoped>
$text-color: #606266;

.nav {
  display: grid;
  grid-template-rows: min-content 1fr;
  grid-template-columns: min-content min-content;
  height: 100%;

  a {
    text-decoration: none;

    span {
      color: $text-color;
    }
  }

  .home-nav-item {
    display: flex;
    align-items: center;
    padding: 12px;
    gap: 8px;
    font-size: 26px;
    grid-column: span 2;
  }

  .nav-item-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    gap: 8px;
    padding: 12px;
    width: 180px;
    position: relative;
    transition: all 0.3s ease-in-out;

    .toggle-btn {
      position: absolute;
      top: 50%;
      right: 0;
      border: 1px solid black;
      transition: all 0.3s ease-in-out;
      transform: translate(35%, -50%);
      z-index: 1000;
    }

    .level-1 {
      font-size: 20px;
    }

    .level-2 {
      font-size: 16px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 12px;
      cursor: pointer;
      gap: 8px;
      border-radius: 8px;

      &:hover {
        background-color: $item-hover;
      }
    }

    .active {
      background-color: $item-active;
      font-weight: bold;
    }
  }

  .wrapper-level-1 {
    background-color: #e0e0e0;
    border-radius: 6px;
    transition: width 0.3s ease-in-out;
  }

  .wrapper-level-2 {
    background-color: #f0f0f0;
    border-radius: 6px;
    transition: width 0.3s ease-in-out;
  }

  .nav-inactive {
    width: 72px;
  }
}
</style>
