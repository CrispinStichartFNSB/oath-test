import type {
  AccountInfo,
  AuthenticationResult,
  IdTokenClaims,
} from "@azure/msal-browser";

export interface Account {
  accountInfo: AccountInfo;
  token: AuthenticationResultTyped | undefined;
  requiresUserInteraction: boolean;
}

export function newAccount(info: AccountInfo): Account {
  return {
    accountInfo: info,
    token: undefined,
    requiresUserInteraction: false,
  };
}

/* For whatever reason, AuthenticationResultTyped.idTokenClaims is typed simply
as "object", so typescript forbids us from accessing members without casting
first.

So here we create a new type that's all of AuthenticationResult, but with the
idTokenClaims type changed to what it is for AccountInfo. */
export type AuthenticationResultTyped = Omit<
  AuthenticationResult,
  "idTokenClaims"
> & {
  idTokenClaims: IdTokenClaims & {
    [key: string]: string | number | string[] | object | undefined | unknown;
  };
};
