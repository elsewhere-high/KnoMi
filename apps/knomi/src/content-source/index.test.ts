import { afterEach, describe, expect, it, vi } from "vitest";
import { normalizeContentHubConfig } from "../config.js";
import { createContentSource, GitHubContentSource, BundleServiceSource } from "./index.js";

afterEach(() => vi.restoreAllMocks());
describe("Content Hub configuration", () => {
	it("keeps an unconfigured library offline and explains unavailable imports", async () => {
		const fetch = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Unexpected network call"));
		for (const type of ["github", "bundle"] as const) {
			const source = createContentSource(normalizeContentHubConfig({ type }));
			expect(await source.listItems("skills")).toEqual([]);
			expect(await source.listItems("presets")).toEqual([]);
			expect(await source.readItemTextFile("skills", "demo", "SKILL.md")).toBeNull();
			await expect(source.downloadItem("skills", "demo", "/unused")).rejects.toThrow("Configure a Content Hub");
		}
		expect(fetch).not.toHaveBeenCalled();
	});
	it("retains both configured transports", () => {
		expect(createContentSource(normalizeContentHubConfig({ owner: "example", repo: "learning" }))).toBeInstanceOf(GitHubContentSource);
		expect(createContentSource(normalizeContentHubConfig({ type: "bundle", baseUrl: "http://127.0.0.1:4310" }))).toBeInstanceOf(BundleServiceSource);
	});
});
