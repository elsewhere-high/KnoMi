import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getWikiStats } from "../../api/wiki.js";
import { settingsStore } from "../../stores/settings-store.js";
import type { WikiStats } from "../../types/wiki.js";
import { useStoreSnapshot } from "../hooks.js";
import { SettingsSection, SettingsCard } from "./primitives.js";
import { formatBytes } from "./shared.js";
import { BrandMark } from "../BrandMark.js";
import packageJson from "../../../package.json";

export function AboutSettings() {
	const { t } = useTranslation();
	const [healthOk, setHealthOk] = useState(false);
	const [wikiStats, setWikiStats] = useState<WikiStats | null>(null);
	const state = useStoreSnapshot(settingsStore, () => ({
		settings: settingsStore.settings,
		isLoading: settingsStore.isLoading,
		error: settingsStore.error,
	}));

	useEffect(() => {
		void fetch("/api/health").then((res) => setHealthOk(res.ok)).catch(() => setHealthOk(false));
		void getWikiStats().then(setWikiStats).catch(() => setWikiStats(null));
	}, []);

	return (
		<SettingsSection title={t("settings.tabs.about")} description={t("settings.sections.about.desc", "服务状态与存储统计")}>
			<div className="mb-4 flex items-center gap-4 rounded-2xl border border-[var(--knomi-border)] bg-[var(--knomi-accent-soft)] p-5">
				<BrandMark className="h-12 w-12 shrink-0" />
				<div><h3 className="text-xl font-semibold text-[var(--knomi-text)]">KnoMi</h3><p className="mt-1 text-sm text-[var(--knomi-text-muted)]">{t("settings.brandDescription")}</p><p className="mt-2 text-xs text-[var(--knomi-text-subtle)]">MIT · © 2026 Ustinian</p></div>
			</div>
			<SettingsCard>
				<div className="mb-3 flex items-center justify-between">
					<h4 className="text-sm font-medium text-[var(--knomi-text)]">{t("settings.title")}</h4>
					<button className="shrink-0 rounded-md border border-[var(--knomi-border)] bg-[var(--knomi-surface)] px-3 py-1.5 text-sm text-[var(--knomi-text-muted)] hover:bg-[var(--knomi-surface-muted)] hover:text-[var(--knomi-text)]" onClick={() => void settingsStore.load()}>
						{t("settings.refresh")}
					</button>
				</div>
				{state.isLoading ? <div className="text-sm text-[var(--knomi-text-muted)]">{t("settings.loading")}</div> : null}
				{state.error ? <div className="rounded bg-[var(--knomi-danger-bg)] p-2 text-sm text-[var(--knomi-danger)]">{state.error}</div> : null}
				<div className="grid gap-3 text-sm min-[30rem]:grid-cols-3">
					<div className="rounded border border-[var(--knomi-border)] bg-[var(--knomi-surface-muted)] p-3">
						<div className="text-xs text-[var(--knomi-text-muted)]">{t("settings.stats.version")}</div>
						<div className="font-medium text-[var(--knomi-text)]">v{packageJson.version}</div>
					</div>
					<div className="rounded border border-[var(--knomi-border)] bg-[var(--knomi-surface-muted)] p-3">
						<div className="text-xs text-[var(--knomi-text-muted)]">{t("settings.stats.server")}</div>
						<div className={healthOk ? "font-medium text-[var(--knomi-success)]" : "font-medium text-[var(--knomi-danger)]"}>
							{healthOk ? t("settings.stats.healthy") : t("settings.stats.offline")}
						</div>
					</div>
					<div className="min-w-0 rounded border border-[var(--knomi-border)] bg-[var(--knomi-surface-muted)] p-3">
						<div className="text-xs text-[var(--knomi-text-muted)]">{t("settings.stats.defaultModel")}</div>
						<div className="font-medium text-[var(--knomi-text)] [overflow-wrap:anywhere]">{state.settings ? `${state.settings.defaultProvider}/${state.settings.defaultModel}` : "-"}</div>
					</div>
					<div className="rounded border border-[var(--knomi-border)] bg-[var(--knomi-surface-muted)] p-3">
						<div className="text-xs text-[var(--knomi-text-muted)]">{t("settings.stats.wiki")}</div>
						<div className="font-medium text-[var(--knomi-text)]">
							{wikiStats ? t("settings.stats.wikiStat", { count: wikiStats.pageCount, size: formatBytes(wikiStats.totalSize) }) : "-"}
						</div>
					</div>
				</div>
			</SettingsCard>
		</SettingsSection>
	);
}
