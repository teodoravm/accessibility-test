import React, { DetailedHTMLProps, HTMLAttributes, useEffect, useState } from 'react';

type AlertPlayerProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    message: string;
    ariaLive?: 'assertive' | 'polite';
    ariaAtomic?: boolean;
    delay?: number;
    classess?: string;
};

/**
 * Аn accessible live region component used to announce messages to screen readers.
 * It displays a message after an optional delay, using ARIA live properties for screen reader support.
 *
 * @param {string} message - The message to be announced to screen readers and shown on screen.
 * @param {'assertive' | 'polite'} [ariaLive='polite'] - Determines the priority for screen readers when announcing the message.
 * @param {boolean} [ariaAtomic=true] - If true, the entire contents of the live region are presented to assistive technologies.
 * @param {number} [delay] - Optional delay in milliseconds before the message appears and is announced.
 * @param {string} [className] - Optional additional CSS classes to style the alert container.
 *
 * @example
 * <AlertPlayer
 *   message="Form submitted successfully!"
 *   ariaLive="assertive"
 *   delay={500}
 *   className="text-green-600"
 * />
 */
const AlertPlayer: React.FC<AlertPlayerProps> = ({ message, ariaLive = "polite", ariaAtomic = true, delay, className }) => {
    const [displayMessage, setDisplayMessage] = useState<string | null>(null);

    useEffect(() => {
        let timer:  NodeJS.Timeout;
        if (delay) {
            timer = setTimeout(() => {
                setDisplayMessage(message);
            }, delay);
        } else {
            setDisplayMessage(message);
        }
        

        return () => clearTimeout(timer);
    }, [message, delay]);

    function playMessage() {
        if (displayMessage && typeof displayMessage !== 'string') {
            console.error(`Invalid message provided: ${displayMessage}`);
        }

        return <p>{displayMessage}</p>;
    }

    return (
        <div aria-atomic={ariaAtomic} aria-live={ariaLive} tabIndex={-1} className={className}>
            {playMessage()}
        </div>
    );
};

export default AlertPlayer;
