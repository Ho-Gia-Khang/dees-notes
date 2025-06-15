<template>
  <div class="document_library">
    <div class="document_library-header">
      <h2>Documents library</h2>
      <p class="title-description">Your private documents library</p>
    </div>

    <FileUploader
      :allowed-file-types="ALLOWED_FILE_TYPES"
      :batch-size="BATCH_SIZE"
      :loaded-files="state.documentsList"
      :loading="state.isWorking"
      v-model="fileIntermediates"
      @upload="startUpload"
    />
  </div>
</template>

<script setup lang="ts">
import useDocumentStore from "@/stores/document";
import FileUploader from "@/components/shared/file-uploader.vue";

import { ALLOWED_FILE_TYPES } from "../constants";
import {
  EUploadStatus,
  type IFileIntermediate,
  type IUploadController,
} from "@/types/shared/fileUpload";
import { computed, nextTick, ref } from "vue";
import useUploadController from "@/api/uploadController";

const BATCH_SIZE = 6;

const { state } = useDocumentStore();
const fileIntermediates = ref<IFileIntermediate[]>([]);

const uploadResource = useUploadController();

const isUploading = computed(() =>
  fileIntermediates.value.some((file) => file.status === EUploadStatus.Uploading),
);

async function startUpload() {
  state.isWorking = true;

  function isUploadable(file: IFileIntermediate): boolean {
    return (
      file.status === EUploadStatus.Idle ||
      file.status === EUploadStatus.Canceled ||
      file.status === EUploadStatus.Error
    );
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
  file.status = EUploadStatus.Uploading;

  const uploadController: IUploadController = {
    cancel: undefined,
  };

  return new Promise<void>((resolve, reject) => {
    uploadResource
      .upload("documents", file.file, uploadController)
      .then((response) => {
        file.status = EUploadStatus.Done;

        fileIntermediates.value = fileIntermediates.value.filter((f) => f.id !== file.id);
        state.documentsList.push(response);
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
</script>

<style scoped lang="scss">
@use "@/assets/shared.scss";

.document_library {
  display: flex;
  flex-direction: column;
  padding: 0 10px;

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
