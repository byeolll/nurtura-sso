export const cleanInput = (text: string): string => {
  return text
    .replace(/\s/g, "")
    .replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF])+?/g,
      ""
    );
};

export const validateEmail = (email: string): string => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (email.trim() === "") {
    return "";
  }
  
  if (!regex.test(email)) {
    return "Please enter a valid email address.";
  }
  
  return "";
};

export const validatePassword = (password: string): string => {
  if (password.trim() === "") {
    return "";
  }
  
  // Add more password validation rules as needed
  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }
  
  return "";
};