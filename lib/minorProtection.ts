/**
 * EMERGENCY PII PROTECTION FOR MINORS
 * 
 * Critical compliance functions to prevent collection of
 * sensitive personal information from users under 18
 */

export interface PIIField {
  fieldName: string;
  isRestricted: boolean;
  reason?: string;
}

// Fields that are NEVER allowed for minors
const PROHIBITED_MINOR_FIELDS = [
  'socialSecurity',
  'driversLicense', 
  'passport',
  'previousAddresses',
  'criminalHistory',
  'militaryService'
];

// Fields that require parental consent for minors
const CONSENT_REQUIRED_FIELDS = [
  'phoneNumber',
  'currentCity',
  'currentState', 
  'occupation',
  'employer'
];

// Basic fields allowed with restrictions
const RESTRICTED_MINOR_FIELDS = [
  'bio',
  'tagline',
  'education'
];

/**
 * Check if a field can be collected from a minor
 */
export function canCollectFieldFromMinor(
  fieldName: string, 
  hasParentalConsent: boolean = false,
  age?: number
): PIIField {
  // Absolutely prohibited for all minors
  if (PROHIBITED_MINOR_FIELDS.includes(fieldName)) {
    return {
      fieldName,
      isRestricted: true,
      reason: 'Sensitive government information prohibited for users under 18'
    };
  }

  // Requires explicit parental consent
  if (CONSENT_REQUIRED_FIELDS.includes(fieldName)) {
    if (!hasParentalConsent && age && age < 16) {
      return {
        fieldName,
        isRestricted: true,
        reason: 'Requires parental consent for users under 16'
      };
    }
  }

  // Basic fields with content restrictions
  if (RESTRICTED_MINOR_FIELDS.includes(fieldName)) {
    return {
      fieldName,
      isRestricted: false,
      reason: 'Allowed with content moderation'
    };
  }

  // All other fields generally allowed
  return {
    fieldName,
    isRestricted: false
  };
}

/**
 * Get all restricted fields for a minor user
 */
export function getRestrictedFieldsForMinor(
  hasParentalConsent: boolean = false,
  age?: number
): string[] {
  const allFields = [
    ...PROHIBITED_MINOR_FIELDS,
    ...CONSENT_REQUIRED_FIELDS,
    ...RESTRICTED_MINOR_FIELDS
  ];

  return allFields.filter(field => {
    const check = canCollectFieldFromMinor(field, hasParentalConsent, age);
    return check.isRestricted;
  });
}

/**
 * Sanitize profile data for minor users
 */
export function sanitizeMinorProfileData(
  profileData: Record<string, any>,
  isMinor: boolean,
  hasParentalConsent: boolean = false,
  age?: number
): Record<string, any> {
  if (!isMinor) {
    return profileData;
  }

  const sanitized = { ...profileData };
  
  // Remove prohibited fields
  PROHIBITED_MINOR_FIELDS.forEach(field => {
    if (sanitized[field]) {
      delete sanitized[field];
    }
  });

  // Handle consent-required fields
  CONSENT_REQUIRED_FIELDS.forEach(field => {
    if (sanitized[field] && !hasParentalConsent && age && age < 16) {
      delete sanitized[field];
    }
  });

  // Apply content restrictions to allowed fields
  if (sanitized.bio) {
    sanitized.bio = sanitizeTextForMinor(sanitized.bio);
  }
  if (sanitized.tagline) {
    sanitized.tagline = sanitizeTextForMinor(sanitized.tagline);
  }

  return sanitized;
}

/**
 * Basic content sanitization for minor text fields
 */
function sanitizeTextForMinor(text: string): string {
  if (!text || text.length === 0) return text;
  
  // Remove potential contact information patterns
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
  const socialMediaPattern = /@\w+/g;
  
  return text
    .replace(emailPattern, '[email removed]')
    .replace(phonePattern, '[phone removed]')
    .replace(socialMediaPattern, '[social handle removed]')
    .slice(0, 500); // Limit length
}

/**
 * Validation function for profile updates
 */
export function validateMinorProfileUpdate(
  updateData: Record<string, any>,
  userAge: number,
  hasParentalConsent: boolean
): {
  isValid: boolean;
  errors: string[];
  sanitizedData: Record<string, any>;
} {
  const errors: string[] = [];
  const isMinor = userAge < 18;
  
  if (!isMinor) {
    return { isValid: true, errors: [], sanitizedData: updateData };
  }

  // Check each field
  Object.keys(updateData).forEach(field => {
    const fieldCheck = canCollectFieldFromMinor(field, hasParentalConsent, userAge);
    if (fieldCheck.isRestricted) {
      errors.push(`${field}: ${fieldCheck.reason}`);
    }
  });

  const sanitizedData = sanitizeMinorProfileData(
    updateData, 
    isMinor, 
    hasParentalConsent, 
    userAge
  );

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData
  };
}