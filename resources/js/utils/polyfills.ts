/**
 * Polyfill for crypto.randomUUID for browsers that don't support it
 */

// Declare crypto interface to extend window.crypto with randomUUID
declare global {
    interface Crypto {
        randomUUID: () => `${string}-${string}-${string}-${string}-${string}`;
    }
}

export function setupPolyfills(): void {
    // Add crypto.randomUUID polyfill if it doesn't exist
    if (typeof window !== 'undefined' && window.crypto && !window.crypto.randomUUID) {
        window.crypto.randomUUID = function randomUUID(): `${string}-${string}-${string}-${string}-${string}` {
            // RFC4122 compliant UUID v4 implementation
            return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: string) => {
                const randomValue = crypto.getRandomValues(new Uint8Array(1))[0];
                return (
                    parseInt(c) ^ (randomValue & (15 >> (parseInt(c) / 4)))
                ).toString(16);
            }) as `${string}-${string}-${string}-${string}-${string}`;
        };
    }
}
