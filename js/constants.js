/**
 * constants.js
 * Centralized configuration for all external links, policies, and contact information.
 * Update values here to automatically reflect across the entire website.
 */

const APP_CONSTANTS = {
  appName: "Numpath Puzzle",
  // Google Play Store URL (easily updatable when ready)
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.aankit.NumpathPuzzle.numpath_puzzle",
  // Official Notion Privacy Policy
  privacyPolicyUrl: "https://app.notion.com/p/Numpath-Puzzle-Privacy-Policy-3d450ced4a4e8080a553d21c041fedac",
  // Customer Support Email
  supportEmail: "nextyou.inspired.customer@gmail.com",
  // Deep Link URI
  deepLinkScheme: "numpath://daily"
};

// Freeze to prevent accidental modification
Object.freeze(APP_CONSTANTS);
