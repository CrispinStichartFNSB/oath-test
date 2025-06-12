<script setup lang="ts">
const msalStore = useMsalStore();
</script>

<template>
  <div class="m-2">
    <div class="flex gap-1">
      <button @click="msalStore.signIn('popup')">Login</button>
      <button @click="msalStore.signOut('popup')">Log Out</button>
    </div>

    <div v-if="msalStore.accounts.size === 0">No cached accounts</div>
    <div v-else>
      <div>
        Active account:
        {{ msalStore.getActiveAccount?.accountInfo.username ?? "none" }}
      </div>
      <p>Accounts:</p>
      <div v-for="account in msalStore.accounts.values()">
        <Account :account="account" />
      </div>
    </div>
  </div>
</template>
