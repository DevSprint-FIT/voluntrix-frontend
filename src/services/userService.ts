interface SetRoleResponse {
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
    isEmailVerified: boolean;
    isProfileCompleted: boolean;
  };
}

interface ErrorResponse {
  code: string;
  message: string;
}

class UserService {
  private static instance: UserService;

  private constructor() {}

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  private getAuthHeaders(token: string): HeadersInit {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };
  }

  async setUserRole(role: "VOLUNTEER" | "ORGANIZATION" | "SPONSOR", token: string): Promise<{ success: boolean; message: string; data?: SetRoleResponse["data"] }> {
    try {
      console.log("Setting user role:", role);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/set-role`, {
        method: "PATCH",
        headers: this.getAuthHeaders(token),
        body: JSON.stringify({
          role,
        }),
      });

      console.log("Set role response status:", response.status);

      if (!response.ok) {
        const errorResult: ErrorResponse = await response.json();
        console.log("Set role failed with error:", errorResult);
        return {
          success: false,
          message: errorResult.message || "Failed to update role",
        };
      }

      const result: SetRoleResponse = await response.json();
      console.log("Set role successful:", result);
      
      return {
        success: true,
        message: result.message || "Role updated successfully",
        data: result.data,
      };
    } catch (error) {
      console.error("Set role error:", error);
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  }
}

export default UserService.getInstance();
