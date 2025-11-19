export const cleanInput = (text: string): string => {
  return text
    .replace(/\s/g, "")
    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])+?/g,
      ""
    );
};
 
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