interface User {
  id: number;
  email: string;
  name: string;
  role: "VOLUNTEER" | "ORGANIZATION" | "SPONSOR";
  isProfileCompleted: boolean;
}

interface SignupData {
  name: string;
  username?: string;
  email: string;
  password: string;
  role: "VOLUNTEER" | "ORGANIZATION" | "SPONSOR";
}

interface LoginData {
  email: string;
  password: string;
}

interface SignupResponseDto {
    token: string;
    role: string;
    isProfileCompleted: boolean;
}

interface ErrorResponse {
  code: string;
  message: string;
}

interface UserProfileResponse {
  id: number;
  email: string;
  name: string;
  role: string;
  isProfileCompleted: boolean;
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
  
  async signup(data: SignupData): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          username: data.username,
          email: data.email,
          password: data.password,
          role: data.role
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
      
      if (result.token) {
        this.setToken(result.token);
        const user: User = {
          id: 0, 
          email: data.email,
          name: data.name,
          role: result.role as "VOLUNTEER" | "ORGANIZATION" | "SPONSOR",
          isProfileCompleted: result.isProfileCompleted,
        };
        this.user = user;
      }
      
      return {
        success: true,
        message: "Account created successfully",
        ...(this.user ? { user: this.user } : {}),
      };
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
      
      if (result.token) {
        this.setToken(result.token);
        // Create user object from response
        const user: User = {
          id: 0, 
          email: data.email,
          name: "", 
          role: result.role as "VOLUNTEER" | "ORGANIZATION" | "SPONSOR",
          isProfileCompleted: result.isProfileCompleted,
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
    if (this.user && this.user.id !== 0) return this.user;
    
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
        id: result.id,
        email: result.email,
        name: result.name,
        role: result.role as "VOLUNTEER" | "ORGANIZATION" | "SPONSOR",
        isProfileCompleted: result.isProfileCompleted,
      };
      return this.user;
    } catch (error) {
      console.error("Error fetching current user:", error);
      this.clearToken();
      return null;
    }
  }

  async updateUserRole(role: "VOLUNTEER" | "ORGANIZATION" | "SPONSOR"): Promise<{ success: boolean; message: string }> {
    if (!this.isAuthenticated()) {
      return { success: false, message: "Not authenticated" };
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/update-role`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        const errorResult: ErrorResponse = await response.json();
        return { 
          success: false, 
          message: errorResult.message || "Failed to update role" 
        };
      }

      // Update local user object
      if (this.user) {
        this.user.role = role;
      }

      return { success: true, message: "Role updated successfully" };
    } catch (error) {
      console.error("Error updating role:", error);
      return { success: false, message: "Network error. Please try again." };
    }
  }
}

export default AuthService.getInstance();