/**
 * Shared input className — routes border/bg/text/focus through --knomi-* theme
 * vars so inputs render correctly under all 4 themes. Focus ring uses
 * --knomi-ring (a box-shadow) via `shadow-` not `ring-`, and `focus-visible:`
 * so it doesn't fire on mouse click.
 */
export const inputCls =
	"h-8 w-full rounded-md border border-[var(--knomi-border)] bg-[var(--knomi-surface)] px-2.5 text-sm font-normal text-[var(--knomi-text)] placeholder:text-[var(--knomi-text-subtle)] transition-colors focus-visible:border-[var(--knomi-focus-border)] focus-visible:outline-none focus-visible:shadow-[var(--knomi-ring)]";

/** Textarea variant — same base, grows vertically. */
export const textareaCls =
	"w-full rounded-md border border-[var(--knomi-border)] bg-[var(--knomi-surface)] px-2.5 py-1.5 text-sm font-normal text-[var(--knomi-text)] placeholder:text-[var(--knomi-text-subtle)] transition-colors focus-visible:border-[var(--knomi-focus-border)] focus-visible:outline-none focus-visible:shadow-[var(--knomi-ring)]";
