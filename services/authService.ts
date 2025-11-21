import {
    SendOTPRequest,
    SendOTPResponse,
    SSOUserCheckResponse,
    VerifyOTPRequest,
    VerifyOTPResponse,
} from "@/types/interface";

export class AuthService {
  private baseUrl: string;

  constructor(localIP: string, port: string) {
    this.baseUrl = `http://${localIP}:${port}`;
  }

  // for createAccount
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/users/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      return response.status === 409;
    } catch (error) {
      console.error("Error checking email:", error);
      throw new Error("Failed to check email availability");
    }
  }

  async sendOTP(data: SendOTPRequest): Promise<SendOTPResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/email-service/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send OTP");
      }

      return {
        success: true,
        message: result.message || "OTP sent successfully",
      };
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw new Error("Failed to send OTP. Please try again later.");
    }
  }

  async checkSSONewUser(email: string): Promise<SSOUserCheckResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/users/SSO-isNewUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.status === 404) {
        throw new Error("Account not found. Please sign up.");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error checking SSO user:", error);
      throw error;
    }
  }

  generateOTP(): number {
    return Math.floor(10000 + Math.random() * 90000);
  }

  getOTPExpiryTime(): string {
    const currentTime = new Date();
    const expireTime = new Date(currentTime.getTime() + 15 * 60000);
    return expireTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // for emailOTP
  async verifyOTP(data: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/email-service/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Invalid OTP");
      }

      return {
        success: true,
        message: result.message || "OTP verified successfully",
      };
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      throw new Error(error.message || "Failed to verify OTP");
    }
  }

  async resendOTP(email: string): Promise<SendOTPResponse> {
    const otp = this.generateOTP();
    const expiryTime = this.getOTPExpiryTime();

    return this.sendOTP({
      email,
      code: otp,
      time: expiryTime,
    });
  }
}
