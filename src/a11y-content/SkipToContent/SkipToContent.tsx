import React from "react";
import "./style.css"

type SkipToContentProps = {
    targetElementId: string;
    label?: string;
    classess?: string
};

/**
 * SkipToContent is an accessibility feature that allows keyboard and screen reader users
 * to bypass navigation and jump directly to the main content of the page.
 * 
 * It renders a visually hidden anchor link (or styled as needed) that becomes visible
 * when focused, enabling quicker navigation for users relying on assistive technologies.
 *
 * @param {string} targetElementId - The ID of the element that should receive focus when the link is activated.
 * @param {string} [label="Skip to content"] - Optional label to be read by screen readers.
 * @param {string} [classess] - Optional additional class names to style the link.
 *
 * @example
 * <SkipToContent targetElementId="mainContent" />
 */
const SkipToContent: React.FC<SkipToContentProps> = ({
    targetElementId,
    label = "Skip to content",
    classess = "",
}) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const targetElement = document.getElementById(targetElementId);
        console.error(targetElement);
        if (targetElement) {
            targetElement.focus();
        }
    };

    return (
        <a
            href={`#${targetElementId}`}
            onClick={handleClick}
            className={`skip-link ${classess}`}
        >
            {label}
        </a>
    );
};

export default SkipToContent
