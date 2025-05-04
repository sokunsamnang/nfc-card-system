/**
 * URL Utility Functions
 */

/**
 * Generates a full public profile URL for a publicUrl
 *
 * @param publicUrl The user's public URL string
 * @returns The full URL to access the profile
 */
export const getPublicProfileUrl = (publicUrl: string): string => {
    const baseUrl = process.env.PUBLIC_BASE_URL || "http://localhost:3001";
    return `${baseUrl}/profile/${publicUrl}`;
};
