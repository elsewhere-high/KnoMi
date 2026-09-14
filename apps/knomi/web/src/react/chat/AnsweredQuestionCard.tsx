import { useTranslation } from "react-i18next";
import type { AnsweredQuestionnaire } from "../../utils/questionnaire.js";
import { normalizeMarkdownMath } from "../../utils/markdown-math.js";

// Pure, props-driven questionnaire rendering. This module must NOT import
// stores or the api/ layer — apps/showcase reuses it (via chat/MessageBubble)
// to replay recorded sessions, so everything here renders from props alone.

export function OptionRow({
	label,
	description,
	selected,
	multi,
	onSelect,
	onFocus,
	readOnly = false,
}: {
	label: string;
	description: string;
	selected: boolean;
	multi: boolean;
	onSelect?: () => void;
	onFocus?: () => void;
	readOnly?: boolean;
}) {
	return (
		<button
			aria-pressed={selected}
			className={`flex w-full items-start gap-2.5 rounded-md border px-3 py-2 text-left text-[13px] transition-colors ${
				selected
					? "border-[var(--knomi-accent)] bg-[var(--knomi-accent-soft)] text-[var(--knomi-text)]"
					: `border-[var(--knomi-border)] bg-[var(--knomi-surface)] text-[var(--knomi-text)] ${readOnly ? "opacity-60" : "hover:border-[var(--knomi-border-strong)] hover:bg-[var(--knomi-surface-muted)]"}`
			}`}
			disabled={readOnly}
			onClick={onSelect}
			onMouseEnter={onFocus}
		>
			<span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-[var(--knomi-border-strong)]">
				{selected ? (
					<span className={`block ${multi ? "h-2 w-2 rounded-sm bg-[var(--knomi-accent)]" : "h-2 w-2 rounded-full bg-[var(--knomi-accent)]"}`} />
				) : null}
			</span>
			<span className="min-w-0 flex-1">
				<markdown-block className="font-medium" content={normalizeMarkdownMath(label)} />
				{description ? <markdown-block className="mt-0.5 text-xs text-[var(--knomi-text-muted)]" content={normalizeMarkdownMath(description)} /> : null}
			</span>
		</button>
	);
}

/** Read-only counterpart to the pending questionnaire. It deliberately keeps
 * the original options visible so the selected state remains part of the
 * conversation instead of disappearing into generic tool-call details. */
export function AnsweredQuestionCard({ questionnaire }: { questionnaire: AnsweredQuestionnaire }) {
	const { t } = useTranslation();

	return (
		<div className="w-full max-w-[36.5rem] rounded-lg border border-[var(--knomi-accent-soft)] bg-[var(--knomi-surface)] px-4 py-3 shadow-sm">
			<div className="mb-3 text-xs font-medium text-[var(--knomi-accent)]">{t("question.answered")}</div>
			<div className="space-y-4">
				{questionnaire.questions.map((question, questionIndex) => {
					const answer = questionnaire.result.answers.find((item) => item.questionIndex === questionIndex);
					if (!answer) return null;
					const selectedLabels = new Set(answer.selected ?? (answer.kind === "option" && answer.answer ? [answer.answer] : []));
					return (
						<div key={`${question.question}-${questionIndex}`} className="space-y-2">
							{questionnaire.questions.length > 1 ? (
								<div className="text-xs font-medium text-[var(--knomi-text-muted)]">{question.header}</div>
							) : null}
							<markdown-block className="text-sm font-medium text-[var(--knomi-text)]" content={normalizeMarkdownMath(question.question)} />
							<div className="space-y-1.5">
								{question.options.map((option) => (
									<OptionRow
										key={option.label}
										label={option.label}
										description={option.description}
										selected={selectedLabels.has(option.label)}
										multi={question.multiSelect === true}
										readOnly
									/>
								))}
								{answer.kind === "custom" && answer.answer ? (
									<div className="rounded-md border border-[var(--knomi-accent)] bg-[var(--knomi-accent-soft)] px-3 py-2 text-[13px] text-[var(--knomi-text)]">
										{answer.answer}
									</div>
								) : null}
								{answer.kind === "chat" ? (
									<div className="text-xs text-[var(--knomi-text-muted)]">
										{answer.answer ?? t("question.answeredViaChat")}
									</div>
								) : null}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
