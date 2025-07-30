import { AxiosHeaders } from "axios";

interface User {
  userId: number;
  email: string;
  fullName: string;
  handle: string;
  role: string;
  emailVerified: boolean;
  profileCompleted: boolean;
  authProvider: string;
  createdAt: string;
  lastLogin: string;
}

interface SignupData {
  email: string;
  handle: string;
  fullName: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface SignupResponseDto {
  message: string;
  data: {
    token: string;
    refreshToken: string;
    userId: number;
    email: string;
    handle: string;
    fullName: string;
    role: string;
    createdAt: string;
    lastLogin: string;
    authProvider: string;
    nextStep: string;
    redirectUrl: string;
    emailVerified: boolean;
    profileCompleted: boolean;
  };
}

interface ErrorResponse {
  code: string;
  message: string;
}

interface UserProfileResponse {
  message: string;
  data: {
    userId: number;
    email: string;
    fullName: string;
    handle: string;
    role: string;
    emailVerified: boolean;
    profileCompleted: boolean;
    authProvider: string;
    createdAt: string;
    lastLogin: string;
  };
}

class AuthService {
  private static instance: AuthService;
  private user: User | null = null;
  private token: string | null = null;
  private refreshToken: string | null = null;

  private constructor() {
    // Initialize token from localStorage on startup
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
      this.refreshToken = localStorage.getItem("auth_refresh_token");
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  getToken(): string | null {
    if (this.token) return this.token;

    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }

    return this.token;
  }

  getRefreshToken(): string | null {
    if (this.refreshToken) return this.refreshToken;

    if (typeof window !== "undefined") {
      this.refreshToken = localStorage.getItem("auth_refresh_token");
    }

    return this.refreshToken;
  }

  private setToken(token: string): void {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  private setRefreshToken(token: string): void {
    this.refreshToken = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_refresh_token", token);
    }
  }

  // Public method to set new token (for role updates)
  setNewToken(token: string): void {
    this.setToken(token);
    this.user = null;
  }

  private clearToken(): void {
    this.token = null;
    this.refreshToken = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_refresh_token");
    }
  }

  public getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    const refreshToken = this.getRefreshToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (refreshToken) {
      headers["X-Refresh-Token"] = refreshToken;
    }

    return headers;
  }

  public getAuthHeadersAxios(): AxiosHeaders {
    const token = this.getToken();
    const headers = new AxiosHeaders();
    headers.set("Content-Type", "application/json");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  }

  async signup(
    data: SignupData
  ): Promise<{
    success: boolean;
    message: string;
    user?: User;
    nextStep?: string;
  }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            handle: data.handle,
            fullName: data.fullName,
            password: data.password,
          }),
        }
      );

      if (!response.ok) {
        const errorResult: ErrorResponse = await response.json();
        return {
          success: false,
          message: errorResult.message || "Signup failed",
        };
      }

      const result: SignupResponseDto = await response.json();

      if (result.data.token) {
        this.setToken(result.data.token);
        this.setRefreshToken(result.data.refreshToken);
        const user: User = {
          userId: result.data.userId,
          email: result.data.email,
          fullName: result.data.fullName,
          handle: result.data.handle,
          role: result.data.role,
          emailVerified: result.data.emailVerified,
          profileCompleted: result.data.profileCompleted,
          authProvider: result.data.authProvider,
          createdAt: result.data.createdAt,
          lastLogin: result.data.lastLogin,
        };
        this.user = user;
      }

      const returnValue = {
        success: true,
        message: result.message,
        nextStep: result.data.nextStep,
        ...(this.user ? { user: this.user } : {}),
      };

      console.log(
        "AuthService returning:",
        JSON.stringify(returnValue, null, 2)
      );

      return returnValue;
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, message: "Network error. Please try again." };
    }
  }

  async login(
    data: LoginData
  ): Promise<{
    success: boolean;
    message: string;
    user?: User;
    nextStep?: string;
  }> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        }
      );

      if (!response.ok) {
        const errorResult: ErrorResponse = await response.json();
        return {
          success: false,
          message: errorResult.message || "Login failed",
        };
      }

      const result: SignupResponseDto = await response.json();
      console.log("Login API response:", result);

      if (result.data.token) {
        this.setToken(result.data.token);
        this.setRefreshToken(result.data.refreshToken);
        // Create user object from response
        const user: User = {
          userId: result.data.userId,
          email: result.data.email,
          fullName: result.data.fullName,
          handle: result.data.handle,
          role: result.data.role,
          emailVerified: result.data.emailVerified,
          profileCompleted: result.data.profileCompleted,
          authProvider: result.data.authProvider,
          createdAt: result.data.createdAt,
          lastLogin: result.data.lastLogin,
        };
        this.user = user;
        console.log("User logged in:", this.user);

        // Determine next step based on user state
        let nextStep = "dashboard"; // default

        if (!user.role || user.role === "null") {
          nextStep = "role-selection";
        } else if (user.role && !user.profileCompleted) {
          nextStep = "profile-form";
        } else if (user.profileCompleted) {
          nextStep = "dashboard";
        }

        console.log("Determined next step:", nextStep);

        return {
          success: true,
          message: result.message || "Login successful",
          user: this.user,
          nextStep: nextStep,
        };
      } else {
        return {
          success: false,
          message: "No authentication token received",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Network error. Please try again." };
    }
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      this.clearToken();
      this.user = null;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.user && this.user.userId !== 0) return this.user;

    if (!this.isAuthenticated()) return null;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
          return null;
        }
        const errorResult: ErrorResponse = await response.json();
        throw new Error(errorResult.message || "Failed to get user data");
      }

      const result: UserProfileResponse = await response.json();
      this.user = {
        userId: result.data.userId,
        email: result.data.email,
        fullName: result.data.fullName,
        handle: result.data.handle,
        role: result.data.role,
        emailVerified: result.data.emailVerified,
        profileCompleted: result.data.profileCompleted,
        authProvider: result.data.authProvider,
        createdAt: result.data.createdAt,
        lastLogin: result.data.lastLogin,
      };
      return this.user;
    } catch (error) {
      console.error("Error fetching current user:", error);
      this.clearToken();
      return null;
    }
  }

  async updateProfileStatus(profileCompleted: boolean): Promise<void> {
    try {
      if (this.user) {
        // Update local user state
        this.user.profileCompleted = profileCompleted;

        // Optionally, you can also call backend to update the status
        // await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/profile-status`, {
        //   method: "PUT",
        //   headers: this.getAuthHeaders(),
        //   body: JSON.stringify({ profileCompleted: profileCompleted }),
        // });
      }
    } catch (error) {
      console.error("Error updating profile status:", error);
    }
  }
}

export default AuthService.getInstance();
