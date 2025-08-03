<template>
  <div class="media_library">
    <div class="media_library_header">
      <h2>Media library</h2>
      <p class="title-description">Your private media library</p>
    </div>

    <FileUploader
      :allowed-file-types="ALLOWED_FILE_TYPES"
      :batch-size="BATCH_SIZE"
      :loaded-files="parsedMediaList"
      :loading="isUploading || state.isWorking"
      v-model="fileIntermediates"
      @upload="startUpload"
      @delete="onDeleteFile"
      @download="onDownloadFile"
    />

    <Paginator v-model="state.query" :total="state.total" :disabled="state.isWorking" />
  </div>
</template>
<script setup lang="ts">
import { ALLOWED_FILE_TYPES, IMAGES_FILE_TYPES } from "../constants";

import FileUploader from "@/components/shared/file-uploader.vue";
import Paginator from "@/components/shared/paginator.vue";
import useMediaStore from "@/stores/media";
import {
  EUploadStatus,
  type IFileIntermediate,
  type IUploadController,
} from "@/types/shared/fileUpload";

import { provideChunkedUploadController } from "@/api/chunkedUploadController";
import { provideUploadController } from "@/api/uploadController";
import type { IFile } from "@/types/document/file";
import { computed, nextTick, ref, watch } from "vue";

const BATCH_SIZE = 3;

const { state, deleteFile, downloadFile, getMediaList } = useMediaStore();
const fileIntermediates = ref<IFileIntermediate[]>([]);

const videoUploadResource = provideChunkedUploadController();
const imageUploadResource = provideUploadController();

const isUploading = computed(() =>
  fileIntermediates.value.some((file) => file.status === EUploadStatus.Uploading),
);

async function startUpload() {
  function isUploadable(file: IFileIntermediate): boolean {
    return file.status === EUploadStatus.Idle || file.status === EUploadStatus.Pending;
  }

  const queue = fileIntermediates.value
    .filter(isUploadable)
    .slice(0, BATCH_SIZE)
    .map((file) => {
      const promise = handleFileUpload(file).finally(() => {
        const idx = queue.indexOf(promise);
        if (idx !== -1) {
          queue.splice(idx, 1);
        }
      });

      return promise;
    });

  while (true) {
    const nextFile = fileIntermediates.value.find(isUploadable);

    if (!nextFile) break;

    await Promise.any(queue);
    const newPromise = handleFileUpload(nextFile).finally(() => {
      const idx = queue.indexOf(newPromise);
      if (idx !== -1) {
        queue.splice(idx, 1);
      }
    });
    queue.push(newPromise);
  }

  await Promise.all(queue);
}

async function handleFileUpload(file: IFileIntermediate) {
  if (!file.file) return;

  file.status = EUploadStatus.Uploading;

  const uploadController: IUploadController = {
    cancel: undefined,
  };
  let uploadResource = videoUploadResource;
  console.log(" fileExtension:", file.type);
  if (IMAGES_FILE_TYPES.includes(file.type)) {
    uploadResource = imageUploadResource;
  }

  return new Promise<void>((resolve, reject) => {
    uploadResource.value
      .upload("media", file.file!, uploadController)
      .then((response: IFile) => {
        file.status = EUploadStatus.Done;

        fileIntermediates.value = fileIntermediates.value.filter((f) => f.id !== file.id);
        state.mediaList.push(response);
        resolve();
      })
      .catch((error) => {
        file.status = EUploadStatus.Error;
        file.error = error.message || "An error occurred during upload";
        console.error("Upload error:", error);
        reject();
      });

    if (!uploadController.cancel) {
      throw new Error("Upload controller is not initialized");
    }

    async function internalCancel() {
      file.status = EUploadStatus.Canceled;
      await uploadController.cancel!();
    }

    async function retry() {
      file.status = EUploadStatus.Pending;
      file.error = undefined;

      await nextTick();
      if (!isUploading.value) {
        await startUpload();
      }
    }

    file.task = {
      cancel: internalCancel,
      retry,
    };
  });
}

const parsedMediaList = computed<IFileIntermediate[]>(() =>
  (state.mediaList ?? []).map<IFileIntermediate>((doc) => ({
    id: doc.id,
    name: doc.name,
    type: doc.type,
    size: doc.size,
    status: EUploadStatus.Done,
  })),
);

async function onDeleteFile(event: { fileId: string }) {
  if (!event.fileId) return;

  await deleteFile(event.fileId);
}

async function onDownloadFile(event: { fileId: string; fileName: string }) {
  if (!event.fileId) return;

  await downloadFile(event.fileId, event.fileName);
}

watch(state.query, () => {
  getMediaList();
});
</script>

<style scoped lang="scss">
@use "@/assets/shared.scss";

.media_library {
  display: grid;
  grid-template-rows: min-content 1fr min-content;
  padding: 0 10px;
  height: 100%;

  &-header {
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;

    h2 {
      margin: 0;
    }
  }
}
</style>
