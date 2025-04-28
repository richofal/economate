import { useState, useEffect } from "react";

/**
 * Custom hook to check if a media query matches
 * @param query The media query to check (e.g. "(max-width: 640px)")
 * @returns Boolean indicating if the media query matches
 */
export const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        // Create a media query list
        const mediaQuery = window.matchMedia(query);

        // Set initial match state
        setMatches(mediaQuery.matches);

        // Define callback for media query changes
        const handleMediaQueryChange = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Add event listener (with browser compatibility)
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener("change", handleMediaQueryChange);
        } else {
            // For older browsers
            mediaQuery.addListener(handleMediaQueryChange);
        }

        // Clean up
        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener(
                    "change",
                    handleMediaQueryChange
                );
            } else {
                // For older browsers
                mediaQuery.removeListener(handleMediaQueryChange);
            }
        };
    }, [query]);

    return matches;
};

export default useMediaQuery;
