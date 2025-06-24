import React, { useEffect, useState } from 'react';

type ImageWithAltProps = {
    imageUrl: string;
    customAlt?: string;
    width?: number;
    height?: number;
    classes?: string;
    loading?: 'lazy' | 'eager';
};

const apiKey = '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'

/**
 * AccessibleImage is a React component that renders an image with improved accessibility.
 *
 * @param {string} imageUrl - The URL of the image to display.
 * @param {string} [customAlt] - Optional custom alt text. If not provided, an alt text will be generated.
 * @param {number} [width] - Optional width of the image in pixels.
 * @param {number} [height] - Optional height of the image in pixels.
 * @param {string} [classes] - Optional string of CSS classes to apply to the image element.
 *
 * @example
 * <AccessibleImage
 *   imageUrl="https://example.com/cat.jpg"
 *   width={300}
 *   height={200}
 * />
 */

const AccessibleImage: React.FC<ImageWithAltProps> = ({
    imageUrl,
    customAlt,
    width,
    height,
    classes,
    loading = 'lazy',
}) => {
    const [altText, setAltText] = useState('Loading alt text...');

    useEffect(() => {
        const generateAltText = async () => {
            try {
                const response = await fetch('https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        inputs: imageUrl,
                    }),
                });
                const result = await response.json();
                if (Array.isArray(result) && result[0]?.generated_text) {
                    setAltText(result[0].generated_text);
                } else {
                    setAltText('No description available');
                }
            } catch (error) {
                console.error('Error generating alt text:', error);
                setAltText('Error loading description');
            }
        };
        if (!customAlt) {
            generateAltText();
        } else {
            setAltText(customAlt);
        }
    }, [imageUrl]);

    return <img src={imageUrl} alt={altText} className={classes} width={width} height={height} loading={loading} />;
};

export default AccessibleImage;
