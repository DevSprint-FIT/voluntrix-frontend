interface ErrorResponse {
  code: string;
  message: string;
}

interface VerificationResponse {
  message: string;
  success: boolean;
}

class EmailVerificationService {
  private static instance: EmailVerificationService;

  private constructor() {}

  static getInstance(): EmailVerificationService {
    if (!EmailVerificationService.instance) {
      EmailVerificationService.instance = new EmailVerificationService();
    }
    return EmailVerificationService.instance;
  }

  async verifyEmail(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      if (!response.ok) {
        const errorResult: ErrorResponse = await response.json();
        return {
          success: false,
          message: errorResult.message || "Invalid OTP. Please try again.",
        };
      }

      const result: VerificationResponse = await response.json();
      return {
        success: true,
        message: result.message || "Email verified successfully",
      };
    } catch (error) {
      console.error("Email verification error:", error);
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  }

  async resendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorResult: ErrorResponse = await response.json();
        return {
          success: false,
          message: errorResult.message || "Failed to resend verification code",
        };
      }

      const result: VerificationResponse = await response.json();
      return {
        success: true,
        message: result.message || "Verification code sent successfully",
      };
    } catch (error) {
      console.error("Resend verification error:", error);
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  }
}

export default EmailVerificationService.getInstance();
