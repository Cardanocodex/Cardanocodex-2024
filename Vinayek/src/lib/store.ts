import type { BrowserWallet } from "@meshsdk/core";
import { writable } from "svelte/store";

export const walletStore = writable<BrowserWallet | null>(null);
export const userNameStore = writable<string | null>(null);
