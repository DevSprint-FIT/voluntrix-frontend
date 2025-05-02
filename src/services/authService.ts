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

class AuthService {
  private static instance: AuthService;
  private user: User | null = null;
  private token: string | null = null;
  
  private constructor() {
    // Initialize token from localStorage on startup
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
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
    
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
    
    return this.token;
  }
  
  private setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }
  
  private clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }
  
  private getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }
  
  async signup(data: SignupData): Promise<{ success: boolean; message: string; user?: User; nextStep?: string }> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          handle: data.handle,
          fullName: data.fullName,
          password: data.password
        }),
      });
      
      if (!response.ok) {
        const errorResult: ErrorResponse = await response.json();
        return { 
          success: false, 
          message: errorResult.message || "Signup failed" 
        };
      }
      
      const result: SignupResponseDto = await response.json();
      
      if (result.data.token) {
        this.setToken(result.data.token);
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
      
      console.log("AuthService returning:", JSON.stringify(returnValue, null, 2));
      
      return returnValue;
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, message: "Network error. Please try again." };
    }
  }
  
  async login(data: LoginData): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorResult: ErrorResponse = await response.json();
        return { 
          success: false, 
          message: errorResult.message || "Login failed" 
        };
      }
      
      const result: SignupResponseDto = await response.json();
      
      if (result.data.token) {
        this.setToken(result.data.token);
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
        
        // Immediately fetch full user profile
        await this.getCurrentUser();
      }
      
      return {
        success: true,
        message: "Login successful",
        ...(this.user ? { user: this.user } : {}),
      };
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`, {
        headers: this.getAuthHeaders(),
      });
      
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
        userId: result.userId,
        email: result.email,
        fullName: result.fullName,
        handle: result.handle,
        role: result.role,
        emailVerified: result.emailVerified,
        profileCompleted: result.profileCompleted,
        authProvider: result.authProvider,
        createdAt: result.createdAt,
        lastLogin: result.lastLogin,
      };
      return this.user;
    } catch (error) {
      console.error("Error fetching current user:", error);
      this.clearToken();
      return null;
    }
  }

}

export default AuthService.getInstance();