import type { RefObject } from "react";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { sessionsStore } from "../../stores/sessions-store.js";

export function QuestionHint({ scrollRef }: { scrollRef: RefObject<HTMLDivElement | null> }) {
	const { t } = useTranslation();
	return (
		<div className="mb-2 flex items-center gap-2 rounded-md border border-[var(--knomi-border)] bg-[var(--knomi-accent-soft)] px-3 py-1.5 text-xs text-[var(--knomi-text-muted)]">
			<AlertTriangle size={14} className="shrink-0 text-[var(--knomi-warning)]" />
			<span>{t("common.questionPending")}</span>
			<button
				type="button"
				className="ml-auto shrink-0 rounded px-2 py-0.5 font-medium text-[var(--knomi-warning)] hover:bg-[var(--knomi-surface-muted)]"
				onClick={() => {
					const el = scrollRef.current;
					if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
				}}
			>
				{t("common.questionPendingJump")}
			</button>
		</div>
	);
}

export function BusyBlocker({
	busyBlocker,
}: {
	busyBlocker: { sessionId: string; turnId: string; questionPending: boolean } | null;
}) {
	const { t } = useTranslation();
	if (!busyBlocker) return null;
	return (
		<div className="mb-2 flex items-center gap-2 rounded-md border border-[var(--knomi-border)] bg-[var(--knomi-accent-soft)] px-3 py-1.5 text-xs text-[var(--knomi-text-muted)]">
			<AlertTriangle size={14} className="shrink-0 text-[var(--knomi-warning)]" />
			<span>{t(busyBlocker.questionPending ? "common.sessionBusyQuestion" : "common.sessionBusy")}</span>
			<button
				type="button"
				className="ml-auto shrink-0 rounded px-2 py-0.5 font-medium text-[var(--knomi-warning)] hover:bg-[var(--knomi-surface-muted)]"
				onClick={() => void sessionsStore.stopBusyBlockerAndRetry()}
			>
				{t("common.sessionBusyStop")}
			</button>
			<button
				type="button"
				className="shrink-0 rounded px-2 py-0.5 text-[var(--knomi-text-subtle)] hover:bg-[var(--knomi-surface-muted)]"
				onClick={() => sessionsStore.dismissBusyBlocker()}
			>
				{t("common.sessionBusyDismiss")}
			</button>
		</div>
	);
}
