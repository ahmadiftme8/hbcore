// packages/web/src/utils/get-asset.ts

export const getAssetUrl = (path: string): string => {
    if (!path) return '';
    if (path.startsWith('http')) return path;

    // Address of your bucket
    const baseUrl = "https://hbcore-dev.s3.ir-thr-at1.arvanstorage.ir/images";

    // Remove the first slash from the input path (if it exists)
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // Simplest case: Concatenating two strings.
    // If your path is 'images/hero/...', the result becomes: '.../images/images/hero/...'.
    // This aligns exactly with your current bucket structure.  
    return `${baseUrl}/${cleanPath}`;
};