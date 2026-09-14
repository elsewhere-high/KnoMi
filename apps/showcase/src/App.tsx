import { useEffect } from "react";
import { App as ProductApp } from "@knomi-web/react/App.js";
import { sessionsStore } from "@knomi-web/stores/sessions-store.js";
import { settingsStore } from "@knomi-web/stores/settings-store.js";
import { workspacesStore } from "@knomi-web/stores/workspaces-store.js";
import { useStoreSnapshot } from "@knomi-web/react/hooks.js";
import { fetchCaseIndex } from "./cases.js";
import { mockBackend } from "./mock/runtime.js";
import { ReplayTransport } from "./replay/Transport.js";

let initializationPromise: Promise<void> | null = null;

/**
 * Boot the real product stores against the mock backend, then open the case
 * from the URL hash (or the first case) so the replay starts immediately.
 */
function initializeShowcase(): Promise<void> {
	if (initializationPromise) return initializationPromise;
	initializationPromise = (async () => {
		const cases = await fetchCaseIndex();
		mockBackend.setCases(cases);
		// Preload every case doc so the sidebar/workspace names render from real
		// data and case switches are instant.
		await Promise.all(
			cases.map(async (c) => {
				const { fetchCase } = await import("./cases.js");
				mockBackend.registerDoc(await fetchCase(c.id));
			}),
		);
		await Promise.all([sessionsStore.load(), workspacesStore.load()]);
		void settingsStore.load();
		const hashMatch = /^#\/case\/([^/]+)$/.exec(window.location.hash);
		const initialId = hashMatch ? decodeURIComponent(hashMatch[1]) : cases[0]?.id;
		if (initialId) await sessionsStore.openSession(initialId, { historyMode: "none" });
	})().catch((err) => {
		console.error("[showcase] init failed:", err);
	});
	return initializationPromise;
}


/** Reuse the current application shell so navigation and responsive behavior stay in sync. */
export function App() {
	const currentSessionId = useStoreSnapshot(sessionsStore, () => sessionsStore.currentSessionId);
	useEffect(() => { void initializeShowcase(); }, []);
	useEffect(() => {
		if (currentSessionId) window.history.replaceState(null, "", `#/case/${encodeURIComponent(currentSessionId)}`);
	}, [currentSessionId]);
	useEffect(() => {
		const onHashChange = () => {
			const match = /^#\/case\/([^/]+)$/.exec(window.location.hash);
			const id = match ? decodeURIComponent(match[1]) : null;
			if (id && id !== sessionsStore.currentSessionId) void sessionsStore.openSession(id, { historyMode: "none" });
		};
		window.addEventListener("hashchange", onHashChange);
		return () => window.removeEventListener("hashchange", onHashChange);
	}, []);
	return <><ProductApp /><ReplayTransport /></>;
}
