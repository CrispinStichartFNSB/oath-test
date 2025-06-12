import { defineStore } from "pinia";
import {
  InteractionRequiredAuthError,
  PublicClientApplication,
} from "@azure/msal-browser";
import type { EndSessionPopupRequest, PopupRequest } from "@azure/msal-browser";
import { msalConfig, loginRequest } from "public/authConfig";
import {
  type Account,
  type AuthenticationResultTyped,
  newAccount,
} from "~/types/Account";

export const useMsalStore = defineStore("msal", {
  state: () => ({
    accounts: new Map<string, Account>(),
    myMSALObj: undefined as PublicClientApplication | undefined,
  }),
  actions: {
    async init() {
      this.myMSALObj = new PublicClientApplication(msalConfig);

      await this.myMSALObj.initialize();

      for (let accountInfo of this.myMSALObj?.getAllAccounts()) {
        if (this.accounts.has(accountInfo.username)) {
          continue;
        }
        this.accounts.set(accountInfo.username, newAccount(accountInfo));
      }

      /* This is used as the default for logins and token getting if account or
      account hint not provided */
      this.myMSALObj.setActiveAccount(
        this.accounts.values()?.next().value?.accountInfo ?? null
      );

      for (let account of this.accounts.values() ?? []) {
        this.myMSALObj
          ?.acquireTokenSilent({
            account: account.accountInfo,
            scopes: loginRequest.scopes,
          })
          .then((result) => {
            account.token = result as AuthenticationResultTyped;
          })
          .catch((e) => {
            if (e instanceof InteractionRequiredAuthError) {
              account.requiresUserInteraction = true;
            } else {
              throw e;
            }
          });
      }
    },

    async signIn(method: string, account?: Account) {
      const requestOptions: PopupRequest = {
        ...loginRequest,
        prompt: "select_account",
      };
      requestOptions.loginHint = account?.accountInfo.username;

      if (method === "popup") {
        return this.myMSALObj?.loginPopup(requestOptions).then((result) => {
          this.myMSALObj?.setActiveAccount(result.account);

          let a =
            account ??
            this.accounts.get(result.account.username) ??
            newAccount(result.account);

          this.accounts.set(a.accountInfo.username, a);

          a.token = result as AuthenticationResultTyped;
          a.requiresUserInteraction = false;
        });
      } else if (method === "redirect") {
        throw Error("Not implemented");
        // return this.myMSALObj?.loginRedirect(loginRequest);
      }
    },

    signOut(interactionType: string, account?: Account) {
      if (!this.getActiveAccount) {
        throw Error("No active account");
      }
      const logoutSettings: EndSessionPopupRequest = {
        logoutHint: account?.accountInfo.username,
      };

      if (interactionType === "popup") {
        this.myMSALObj?.logoutPopup(logoutSettings).then(() => {
          window.location.reload();
        });
      } else {
        throw Error("not implemented");
        // this.myMSALObj?.logoutRedirect(logoutSettings);
      }

      const a = account ?? this.getActiveAccount;

      a.requiresUserInteraction = true;
      a.token = undefined;
    },
  },
  getters: {
    getActiveAccount(): Account | undefined {
      let a = this.myMSALObj?.getActiveAccount();
      if (!a) {
        return undefined;
      }
      if (!this.accounts.has(a?.username ?? "")) {
        this.accounts.set(a.username, newAccount(a));
      }
      return this.accounts.get(a.username);
    },
  },
});
