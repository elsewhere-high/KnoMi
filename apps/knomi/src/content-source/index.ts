import type { KnoMiContentHubConfig } from "../config.js";
import { GitHubContentSource } from "./github-source.js";
import { BundleServiceSource } from "./bundle-source.js";
import type { RemoteContentSource } from "./types.js";

export * from "./types.js";
export { GitHubContentSource } from "./github-source.js";
export { BundleServiceSource } from "./bundle-source.js";

/** Keep bundled presets usable without contacting an unconfigured remote. */
class UnconfiguredContentSource implements RemoteContentSource {
	async listItems() { return []; }
	async readItemTextFile() { return null; }
	async downloadItem(): Promise<void> {
		throw new Error("Configure a Content Hub source in Settings before importing remote items.");
	}
	invalidate(): void {}
}

/**
 * Build a configured GitHub or bundle source. With no source configured,
 * return an empty remote catalog while the local preset catalog remains usable.
 *
 * The returned instance owns its own short-lived cache, so the server should
 * create it once and reuse it (recreating it on config change to pick up new
 * owner/repo/token), then call `invalidate()` when settings are saved.
 */
export function createContentSource(hub: KnoMiContentHubConfig): RemoteContentSource {
	const configured = hub.type === "bundle"
		? Boolean(hub.baseUrl.trim())
		: Boolean(hub.owner.trim() && hub.repo.trim());
	if (!configured) return new UnconfiguredContentSource();
	if (hub.type === "bundle") {
		return new BundleServiceSource(hub);
	}
	return new GitHubContentSource(hub);
}
