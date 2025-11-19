// GENERAL 

export const cleanInput = (text: string): string => {
  return text
    .replace(/\s/g, "")
    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])+?/g,
      ""
    );
};
 
// EMAIL

export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}; 

export const validateEmail = (email: string): string => {
  if (!email.trim()) {
    return "";
  }
  return isValidEmail(email) ? "" : "Please enter a valid email address.";
};
 
export const validateLoginFields = (
  email: string,
  password: string
): { isValid: boolean; message: string } => {
  if (!email || !password) {
    return {
      isValid: false,
      message: "Please fill in all fields",
    };
  }
  return { isValid: true, message: "" };
};


// PASSWORD

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  hasUpperCase: boolean;
  hasSymbol: boolean;
  hasDigit: boolean;
  isLongEnough: boolean;
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const isLongEnough = password.length >= 8;

  const errors: string[] = [];
  if (!isLongEnough) errors.push("At least 8 characters");
  if (!hasUpperCase) errors.push("One uppercase letter");
  if (!hasSymbol) errors.push("One symbol");
  if (!hasDigit) errors.push("One number");

  return {
    isValid: hasUpperCase && hasSymbol && hasDigit && isLongEnough,
    errors,
    hasUpperCase,
    hasSymbol,
    hasDigit,
    isLongEnough,
  };
};

export const isStrongPassword = (password: string): boolean => {
  const validation = validatePassword(password);
  return validation.isValid;
};