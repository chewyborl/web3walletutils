import { EIP6963AnnounceProviderEvent, EIP6963ProviderDetail } from "./EIP6963Types";
import { useSyncExternalStore } from "react";

const eip6963announceProvider = "eip6963:announceProvider";
const eip6963requestProvider = "eip6963:requestProvider";

declare global {
  interface WindowEventMap {
    eip6063announcePrivider: CustomEvent<EIP6963AnnounceProviderEvent>;
  }
}

let providers: EIP6963ProviderDetail[] = [];

const eip6963store = {
  value: () => providers,

  subscribe: (callback: () => void) => {
    function onAnnouncement(event: EIP6963AnnounceProviderEvent) {
      // Prevent adding a provider if it already exists in the list based on its uuid.
      if (providers.some(p => p.info.uuid === event.detail.info.uuid)) return;

      // Add the new provider to the list and call the provided callback function.
      providers = [...providers, event.detail];
      callback();
    }

    window.addEventListener(eip6963announceProvider, onAnnouncement as EventListener);
    window.dispatchEvent(new Event(eip6963requestProvider));

    return () => window.removeEventListener(eip6963announceProvider, onAnnouncement as EventListener);
  }
}

const useEip6963SyncProviders = () =>
  useSyncExternalStore(eip6963store.subscribe, eip6963store.value, eip6963store.value);

export {
  eip6963announceProvider,
  eip6963requestProvider,
  eip6963store,
  useEip6963SyncProviders
}