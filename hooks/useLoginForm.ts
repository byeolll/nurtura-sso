import { cleanInput, validateEmail } from "@/utils/validation";
import { useState } from "react";

export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoginInvalid, setIsLoginInvalid] = useState(false);

  const handleEmailChange = (value: string) => {
    const cleaned = cleanInput(value);
    setEmail(cleaned);

    if (cleaned.trim() === "") {
      setEmailError("");
      setIsLoginInvalid(false);
      return;
    }

    const error = validateEmail(cleaned);
    setEmailError(error);
  };

  const handlePasswordChange = (value: string) => {
    const cleaned = cleanInput(value);
    setPassword(cleaned);
    
    if (cleaned.trim() === "" || email.trim() === "") {
      setIsLoginInvalid(false);
    }
  };

  const resetErrors = () => {
    setEmailError("");
    setIsLoginInvalid(false);
  };

  const setLoginError = () => {
    setIsLoginInvalid(true);
  };

  return {
    email,
    password,
    emailError,
    isLoginInvalid,
    handleEmailChange,
    handlePasswordChange,
    resetErrors,
    setLoginError,
  };
};