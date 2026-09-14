/** KnoMi's folded K mark, shared by the workspace and assistant messages. */
export function BrandMark({ className = "h-8 w-8" }: { className?: string }) {
	return (
		<svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
			<rect width="64" height="64" rx="18" fill="#115E4C" />
			<path d="M21 17v30M44 17 28 32l16 15M21 32h7" stroke="#F7F7EE" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
			<circle cx="47" cy="47" r="4" fill="#D6B56D" />
		</svg>
	);
}
