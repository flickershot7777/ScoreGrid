// =============================================
// OPCO Admin Configuration
// =============================================
// Add the email addresses of OPCO administrators here.
// Only users with these emails will have access to the admin panel.
// Change 'admin@examapp.com' to your actual admin email.

export const OPCO_EMAILS = [
  'admin@examapp.com',
];

/**
 * Check if a given email has OPCO (admin) privileges
 * @param {string} email
 * @returns {boolean}
 */
export const isOPCO = (email) => {
  if (!email) return false;
  return OPCO_EMAILS.includes(email.toLowerCase());
};
