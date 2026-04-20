import { useEffect, useRef } from "react";

export function useOutsideClick<T extends HTMLElement>(callback: () => void) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      const target = event.target as HTMLElement;

      // Basic safety: if target is somehow gone or disconnected, ignore
      if (!target || !target.isConnected) return;

      // Check for Radix UI portals and overlays
      const isPortal =
        target.closest("[data-radix-portal]") ||
        target.closest('[role="listbox"]') ||
        target.closest('[role="combobox"]') ||
        target.closest('[role="menu"]') ||
        target.closest('[role="dialog"]') ||
        target.closest("[data-radix-portal-primitive]") ||
        // Also check for common Radix backdrop classes or attributes
        target.hasAttribute("data-radix-focus-guard") ||
        target.classList.contains("radix-select-content") ||
        document
          .querySelector("[data-radix-portal-primitive]")
          ?.contains(target);

      if (isPortal) return;

      if (ref.current && !ref.current.contains(target)) {
        callback();
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [callback]);

  return ref;
}
