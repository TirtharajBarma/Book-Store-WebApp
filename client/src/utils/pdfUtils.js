// Utility functions for handling different PDF URL formats

/**
 * Converts Google Drive preview/view links to embeddable format
 * @param {string} url - Google Drive URL
 * @returns {string} - Embeddable URL
 */
export const convertGoogleDriveUrl = (url) => {
  if (!url) return url;
  
  // Check if it's already converted
  if (url.includes('drive.google.com/uc?export=view')) {
    return url;
  }
  
  // Extract file ID from various Google Drive URL formats
  let fileId = null;
  
  // Format 1: https://drive.google.com/file/d/FILE_ID/view
  const match1 = url.match(/\/file\/d\/([^\/\?]+)/);
  if (match1) {
    fileId = match1[1];
  }
  
  // Format 2: https://drive.google.com/open?id=FILE_ID
  const match2 = url.match(/[?&]id=([^&]+)/);
  if (match2) {
    fileId = match2[1];
  }
  
  // Format 3: Already has uc?export=download
  const match3 = url.match(/[?&]id=([^&]+)/);
  if (match3 && url.includes('uc?')) {
    fileId = match3[1];
  }
  
  if (fileId) {
    // Use viewer mode which has better CORS support
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  
  return url;
};

/**
 * Converts Dropbox links to direct download links
 * @param {string} url - Dropbox URL
 * @returns {string} - Direct download URL
 */
export const convertDropboxUrl = (url) => {
  if (!url) return url;
  
  if (url.includes('dropbox.com')) {
    return url.replace('dl=0', 'dl=1').replace('www.dropbox.com', 'dl.dropboxusercontent.com');
  }
  
  return url;
};

/**
 * Converts various PDF URLs to direct download format
 * @param {string} url - PDF URL
 * @returns {string} - Direct download URL
 */
export const convertToDirectPdfUrl = (url) => {
  if (!url) return url;
  
  // Google Drive
  if (url.includes('drive.google.com')) {
    return convertGoogleDriveUrl(url);
  }
  
  // Dropbox
  if (url.includes('dropbox.com')) {
    return convertDropboxUrl(url);
  }
  
  // Already a direct link
  return url;
};

/**
 * Validates if URL is accessible
 * @param {string} url - URL to validate
 * @returns {Promise<boolean>} - True if accessible
 */
export const validatePdfUrl = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Extracts file ID from Google Drive URL
 * @param {string} url - Google Drive URL
 * @returns {string|null} - File ID or null
 */
export const extractGoogleDriveFileId = (url) => {
  if (!url) return null;
  
  const match1 = url.match(/\/file\/d\/([^\/]+)/);
  if (match1) return match1[1];
  
  const match2 = url.match(/[?&]id=([^&]+)/);
  if (match2) return match2[1];
  
  return null;
};
