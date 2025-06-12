<script setup lang="ts">
import { useMsalStore } from "~/stores/msal";
const msalStore = useMsalStore();

onMounted(() => {
  msalStore.init();
});
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
