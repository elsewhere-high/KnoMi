import { forwardRef, type HTMLAttributes } from "react";

/** Shared visual shell for anchored and portal-rendered popovers. */
export const PopoverSurface = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function PopoverSurface({ className = "", ...props }, ref) {
	return <div ref={ref} className={`knomi-popover-surface${className ? ` ${className}` : ""}`} {...props} />;
});
