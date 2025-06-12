<script setup lang="ts">
import type { Account } from "~/types/Account";

const msalStore = useMsalStore();
const props = defineProps<{ account: Account }>();

const username = computed(() => props.account.accountInfo.username);
const provider = computed(() => props.account.token?.idTokenClaims?.idp);

const providerLogos: Record<string, string> = {
  "facebook.com": "/images/2023_Facebook_icon.svg",
  "google.com": "/images/Google__G__logo.svg",
  "microsoft.com": "/images/Microsoft_logo",
};
</script>

<template>
  <div
    class="w-fit p-4 m-2 bg-neutral-40 border-1 border-neutral-300 rounded-2xl shadow-md"
  >
    <div v-if="account === msalStore.getActiveAccount" class="font-bold">
      Active Account
    </div>
    <button @click="() => console.log(account)">Log Account</button>
    <div>{{ username }}</div>
    <div>provider: {{ provider }}</div>
    <div class="flex">
      <img
        v-if="provider && providerLogos[provider]"
        :src="providerLogos[provider]"
        class="w-10 h-10 m-2"
      />
      <!-- Do they all have these claims? -->
      <div v-if="provider === 'google.com' || provider === 'facebook.com'">
        <div>
          {{ account.token?.idTokenClaims.email }}
        </div>
        {{ account.token?.idTokenClaims.family_name }},
        {{ account.token?.idTokenClaims.given_name }}
      </div>
    </div>
    <button @click="msalStore.signOut('popup', account)">Logout</button>
  </div>
</template>
