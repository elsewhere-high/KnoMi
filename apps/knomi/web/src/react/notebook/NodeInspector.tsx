import { useTranslation } from "react-i18next";
import { notebookStore } from "../../stores/notebook-store.js";
import { useStoreSnapshot } from "../hooks.js";

export function NodeInspector() {
	const { t } = useTranslation();
	const state = useStoreSnapshot(notebookStore, () => ({
		nodes: notebookStore.nodes,
		selectedNodeId: notebookStore.selectedNodeId,
	}));
	const node = state.nodes.find((n) => n.id === state.selectedNodeId) ?? null;

	if (!node) {
		return (
			<aside className="flex h-full flex-col overflow-y-auto border-l border-[var(--knomi-border)] bg-[var(--knomi-surface)] p-3 text-sm text-[var(--knomi-text-muted)]">
				<div className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--knomi-text-muted)]">{t("notebook.inspector.title")}</div>
				<p>{t("notebook.inspector.empty")}</p>
			</aside>
		);
	}
	return (
		<aside className="flex h-full flex-col overflow-y-auto border-l border-[var(--knomi-border)] bg-[var(--knomi-surface)] p-3">
			<div className="mb-1 truncate text-sm font-medium text-[var(--knomi-text)]">{node.title}</div>
			<div className="mb-2 truncate text-xs text-[var(--knomi-text-muted)]">{node.id}</div>
			<div className="mb-3 inline-block rounded bg-[var(--knomi-surface-muted)] px-2 py-0.5 text-xs text-[var(--knomi-text-muted)]">
				{t(`notebook.types.${node.type}`)}
			</div>
			{node.tags.length > 0 ? (
				<div className="mb-3">
					<div className="mb-1 text-xs font-medium text-[var(--knomi-text-muted)]">{t("notebook.inspector.tags")}</div>
					<div className="flex flex-wrap gap-1">
						{node.tags.map((tag) => (
							<span key={tag} className="rounded-full bg-[var(--knomi-accent-soft)] px-1.5 py-0.5 text-xs text-[var(--knomi-accent)]">
								#{tag}
							</span>
						))}
					</div>
				</div>
			) : null}
			<button
				className="rounded-md knomi-primary-button px-3 py-1.5 text-sm text-white disabled:opacity-50"
				disabled={node.type === "tag"}
				onClick={() => void notebookStore.selectPage(node.id)}
			>
				{t("notebook.inspector.openPage")}
			</button>
		</aside>
	);
}
