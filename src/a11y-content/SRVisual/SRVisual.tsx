import { ReactElement } from 'react';

type SRVisualProps = {
    description: string;
    children?: ReactElement;
};

/**
 * SRVisual is a component that provides screen reader (SR) accessibility support
 * by associating a visual element with a textual description or by rendering a screen-reader-only label.
 *
 * When children are provided, it wraps them in a container with an `aria-label` for assistive technologies.
 * If no children are passed, it renders a visually hidden element with the description only.
 *
 * @param {string} description - The text description for screen readers.
 * @param {ReactElement} [children] - Optional visual content to be associated with the description.
 *
 * @example
 * <SRVisual description="This is a rectangle with sides 9cm and 5cm. What is the square?">
 *   <img src="/rectangle.png" alt="Rectangle" />
 * </SRVisual>
 *
 * @example
 * <button><SRVisual description="Press enter or space to submit and" />Check answer.</button>
 */
const SRVisual: React.FC<SRVisualProps> = ({ description, children }) => {
    if (children) {
        return (
            <div aria-label={description} tabIndex={0}>
                {children}
            </div>
        );
    }

    return <span className='sr-only'>{description}</span>
};

export default SRVisual;
