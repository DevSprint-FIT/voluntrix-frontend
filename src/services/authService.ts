interface User {
  id: number;
  email: string;
  name: string;
  // Add other user properties
}

class AuthService {
  private static instance: AuthService;
  private user: User | null = null;
  
  private constructor() {}
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }
  
  isAuthenticated(): boolean {
    return localStorage.getItem("auth_token") !== null;
  }
  
  getToken(): string | null {
    return localStorage.getItem("auth_token");
  }
  
  async logout(): Promise<void> {
    localStorage.removeItem("auth_token");
    this.user = null;
    
    // You may also want to invalidate the token on the server
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }
  
  async getCurrentUser(): Promise<User | null> {
    if (this.user) return this.user;
    
    if (!this.isAuthenticated()) return null;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      });
      
      if (!response.ok) throw new Error("Failed to get user data");
      
      this.user = await response.json();
      return this.user;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  }
}

export default AuthService.getInstance();