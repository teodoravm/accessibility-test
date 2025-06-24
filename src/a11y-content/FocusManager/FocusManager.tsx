import React, {
    useEffect,
    useRef,
    ReactElement,
    Ref,
    useCallback,
    useLayoutEffect,
    HTMLAttributes,
    PropsWithChildren,
} from 'react';

type FocusManagerProps = HTMLAttributes<HTMLDivElement> & {
    children: PropsWithChildren;
    fallbackElement: string;
    focusRectStyle?: { color?: string; width?: number; offset?: number };
    classes?: string;
};

/**
 * FocusManager is a wrapper component that manages focus within a scoped region.
 * It ensures that if a focused element inside the scope is removed from the DOM,
 * focus is redirected to the first available focusable element or a specified fallback element.
 *
 * @param {ReactElement | ReactElement[] | null} children - The content wrapped by the FocusManager.
 * @param {string} fallbackElement - The ID of the element to focus if no focusable elements are found.
 * @param {{ color?: string; width?: number; offset?: number }} [focusRectStyle] - Optional styles for the focus outline.
 * @param {string} [classes] - Optional class names to apply to the wrapper div.
 *
 * @example
 * <FocusManager
 *   fallbackElement="closeModalBtn"
 *   focusRectStyle={{ color: 'blue', width: 3, offset: 2 }}
 * >
 *   <MyModal />
 * </FocusManager>
 */
const FocusManager: React.FC<FocusManagerProps> = ({ children, fallbackElement, focusRectStyle, classes }) => {
    const scopeRef = useRef<HTMLDivElement>(null);
    const previousFocusedElement = useRef<HTMLElement | null>(null);
    const isActiveScope = useRef(false);

    function getFocusableElements() {
        return scopeRef.current
            ? Array.from(
                  scopeRef.current.querySelectorAll<HTMLElement>(
                      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
                  )
              )
            : [];
    }

    useEffect(() => {
        let usingKeyboard = false;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                usingKeyboard = true;
            }
        };

        const handleMouseDown = () => {
            usingKeyboard = false;
        };

        const handleFocusIn = (e: FocusEvent) => {
            const target = e.target as HTMLElement;
            if (scopeRef.current?.contains(target)) {
                isActiveScope.current = true;
                previousFocusedElement.current = target;

                if (usingKeyboard && focusRectStyle) {
                    target.style.outline = `${focusRectStyle.width || 2}px solid ${focusRectStyle.color || 'black'}`;
                    target.style.outlineOffset = `${focusRectStyle.offset || 5}px`;
                }
            }
        };

        const handleFocusOut = (e: FocusEvent) => {
            const target = e.target as HTMLElement;
            if (scopeRef.current?.contains(target)) {
                target.style.outline = '';
                target.style.outlineOffset = '';
            }

            // Mark scope as inactive if focus moved elsewhere
            if (!scopeRef.current?.contains(document.activeElement)) {
                isActiveScope.current = false;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('focusin', handleFocusIn);
        document.addEventListener('focusout', handleFocusOut);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('focusin', handleFocusIn);
            document.removeEventListener('focusout', handleFocusOut);
        };
    }, []);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            if (!previousFocusedElement.current) return;
            if (!scopeRef.current) return;
            const focusableElements: HTMLElement[] = getFocusableElements();
            const stillInDOM = scopeRef.current.contains(previousFocusedElement.current);
            console.error(stillInDOM);
            if (!stillInDOM) {
                console.error(previousFocusedElement.current);
                console.error(focusableElements?.[focusableElements.indexOf(previousFocusedElement.current) + 1]);
                const next =
                    focusableElements?.[focusableElements.indexOf(previousFocusedElement.current) + 1] ||
                    focusableElements?.[focusableElements.length - 1] ||
                    document.getElementById(fallbackElement);
                next?.focus();
            }
        });

        if (scopeRef.current) {
            observer.observe(scopeRef.current, {
                childList: true,
                subtree: true,
            });
        }

        const focusableElements: HTMLElement[] = getFocusableElements();
        const elementToFocus = focusableElements?.[0] ?? document.getElementById(fallbackElement);
        elementToFocus?.focus();

        return () => {
            observer.disconnect();
            const fallback = document.getElementById(fallbackElement);
            fallback?.focus();
        };
    }, [fallbackElement]);

    return (
        <div ref={scopeRef} className={classes}>
            {children}
        </div>
    );
};

export default FocusManager;
