<template>
  <div class="file_uploader">
    <div
      class="file_uploader-upload_area"
      :class="{ dragging: isDragging, disabled: loading }"
      @dragover.prevent
      @dragenter.prevent="onDragEnter"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="onUploadClick"
    >
      <div v-if="!isDragging">
        <span class="explain-text"> Drag and drop files here or </span>
        <ElButton link type="primary">Choose files</ElButton>
      </div>

      <span v-else class="explain-text"> Drop files to upload </span>

      <input
        ref="inputFile"
        style="display: none"
        type="file"
        :accept="allowedFileTypes"
        :multiple="true"
        @change="onFilesPicked"
      />

      <span v-if="!isDragging" class="explain-text">
        Supported file types: {{ allowedFileTypes.split(",").join(", ") }}
      </span>
    </div>

    <div class="action-btn">
      <ElButton
        type="primary"
        :icon="Upload"
        :loading="loading"
        :disabled="loading || !model.length"
        @click="startUpload"
      >
        Start Upload
      </ElButton>
    </div>

    <Transition name="bulk-action">
      <div v-if="selectedFiles.length" class="bulk-action-btn">
        <ElButton :icon="Download" type="primary"> Download </ElButton>
        <ElButton :icon="Delete" type="danger"> Delete </ElButton>
      </div>
    </Transition>

    <ElTable
      :data="filesData"
      key="id"
      class="file_uploader-files_table"
      @select="onSelectFile"
      @select-all="onSelectAllFiles"
    >
      <ElTableColumn type="selection" width="55" />
      <ElTableColumn label="File Name" show-overflow-tooltip>
        <template #default="{ row }">
          <span>{{ row.file.name }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="File Size">
        <template #default="{ row }">
          <span>{{ (row.file.size / 1024 / 1024).toFixed(2) }} MB</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="Uploaded At">
        <template #default="{ row }">
          <span>{{ new Date().toLocaleDateString() }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="Actions">
        <template #default="{ row }">
          <ElTag v-if="row.status === EUploadStatus.Idle" type="info"> Idle </ElTag>
          <ElTag v-else-if="row.status === EUploadStatus.Pending" type="primary"> Pending </ElTag>
          <div v-else-if="row.status === EUploadStatus.Uploading" class="btn-group">
            <ElIcon class="is-loading"> <Loading /> </ElIcon>
            <ElButton :icon="Close" plain type="danger" circle />
          </div>
          <div v-else-if="row.status === EUploadStatus.Canceled" class="btn-group">
            <ElTag type="warning">Canceled</ElTag>
            <ElButton :icon="RefreshLeft" plain type="primary" circle />
          </div>
          <div v-else-if="row.status === EUploadStatus.Error" class="btn-group">
            <ElTag type="danger">{{ row.error || "Error" }}</ElTag>
            <ElButton :icon="RefreshLeft" plain type="primary" circle />
          </div>
          <div v-else>
            <ElButton :icon="View" plain type="primary" circle />
            <ElButton :icon="Delete" plain type="danger" circle />
          </div>
        </template>
      </ElTableColumn>
    </ElTable>
  </div>
</template>

<script setup lang="ts">
import { EUploadStatus, type IFileIntermediate } from "@/types/shared/fileUpload";
import uniqueId from "lodash/uniqueId";
import { FILE_SIZE_LIMIT_MB } from "../documents/constants";

import { computed, onMounted, ref, type PropType } from "vue";
import { ElButton, ElCheckbox, ElIcon, ElTable, ElTableColumn, ElTag } from "element-plus";
import {
  Upload,
  Delete,
  Close,
  RefreshLeft,
  Loading,
  View,
  Download,
} from "@element-plus/icons-vue";

const props = defineProps({
  allowedFileTypes: {
    type: Array as PropType<string[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadedFiles: {
    type: Array as PropType<IFileIntermediate[]>,
    default: () => [],
  },
});

const emits = defineEmits(["upload"]);

const model = defineModel<IFileIntermediate[]>({ default: () => [] });

const isDragging = ref(false);
const inputFile = ref<HTMLInputElement | null>(null);
const selectedFiles = ref<IFileIntermediate[]>([]);

const allowedFileTypes = computed(() => props.allowedFileTypes.join(","));

const filesData = computed<IFileIntermediate[]>(() => model.value.concat(props.loadedFiles));

function onDragEnter(event: DragEvent) {
  if (!event.dataTransfer || props.loading) return;

  isDragging.value = true;
}
function onDragLeave(event: DragEvent) {
  if (props.loading) return;
  isDragging.value = false;
}
function onDrop(event: DragEvent) {
  if (props.loading || !event.dataTransfer) return;

  isDragging.value = false;

  const files = event.dataTransfer.files;
  if (!files) return;

  receiveFiles(files);
}

function onUploadClick() {
  if (inputFile.value) {
    inputFile.value.click();
  }
}
function onFilesPicked(event: Event) {
  if (props.loading || !inputFile.value) return;

  const files = (event.target as HTMLInputElement).files;
  if (!files) return;

  receiveFiles(files);
}

function receiveFiles(files: FileList) {
  const newFiles: IFileIntermediate[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files.item(i);
    if (!file) continue;
    const fileType = "." + file.type.split("/")[1];

    if (!props.allowedFileTypes.includes(fileType)) continue;

    const id = uniqueId("file_");
    let error = undefined;
    if (file.size > FILE_SIZE_LIMIT_MB) {
      // 10 MB limit
      error = "File size exceeds the limit of 10 MB.";
    }

    newFiles.push({
      file,
      id,
      error,
      status: EUploadStatus.Idle,
    });
  }

  if (newFiles.length) {
    model.value = model.value.concat(newFiles);
  }
}

function onSelectFile(data: IFileIntermediate[]) {
  selectedFiles.value = data ?? [];
}

function onSelectAllFiles(selected: any[]) {
  selectedFiles.value = selected ?? [];
}

async function startUpload() {
  if (props.loading || !model.value.length) return;
  emits("upload");
}
</script>

<style lang="scss" scoped>
.file_uploader {
  display: flex;
  flex-direction: column;
  width: 99%;

  &-upload_area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    min-height: 150px;

    &.dragging {
      border-color: #409eff;
      background-color: #f0f9ff;
    }

    &.disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    .explain-text {
      margin-bottom: 10px;
      color: #666;
    }
  }

  .action-btn {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    height: 40px;
  }

  .bulk-action-btn {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    gap: 10px;

    .el-button {
      width: 120px;
    }
  }

  &-files_table {
    width: 100%;
    .btn-group {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
  }
}

.bulk-action-enter-active,
.bulk-action-leave-active {
  transition: all 0.3s ease;
}

.bulk-action-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.bulk-action-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
</style>
