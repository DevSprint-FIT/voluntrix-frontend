# JWT Authentication Implementation Guide

## 🔐 **Updated Authentication Flow for Your Backend DTOs**

### **Backend API Requirements**

Based on your DTOs, here are the expected API contracts:

#### **1. Signup Endpoint**
```http
POST /api/auth/signup
Content-Type: application/json

Request Body (SignupRequestDto):
{
  "email": "john@example.com",
  "password": "securePassword123", 
  "role": "VOLUNTEER" | "ORGANIZATION" | "SPONSOR"
}

Success Response (200 OK) - SignupResponseDto:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "VOLUNTEER",
  "isProfileCompleted": false
}

Error Response (400/409/etc) - ErrorResponse:
{
  "code": "EMAIL_ALREADY_EXISTS",
  "message": "An account with this email already exists"
}
```

#### **2. Login Endpoint**
```http
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "securePassword123"
}

Success Response (200 OK) - Similar to SignupResponseDto:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "VOLUNTEER", 
  "isProfileCompleted": true
}

Error Response (401) - ErrorResponse:
{
  "code": "INVALID_CREDENTIALS",
  "message": "Invalid email or password"
}
```

#### **3. Get Current User Profile**
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Success Response (200 OK) - UserProfileResponse:
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "role": "VOLUNTEER", 
  "isProfileCompleted": true
}

Error Response (401) - ErrorResponse:
{
  "code": "INVALID_TOKEN",
  "message": "Token is invalid or expired"
}
```

#### **4. Logout Endpoint** (Optional)
```http
POST /api/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Success Response (200 OK):
{
  "message": "Logged out successfully"
}
```

## 🎯 **Your DTO Structure Analysis**

Your DTOs are **excellent** and follow best practices:

### ✅ **SignupRequestDto** - Well Designed
```java
@Data
public class SignupRequestDto {
    @NotBlank
    @Email
    private String email;

    @NotBlank  
    private String password;

    @NotNull
    private UserType role;
}
```
**Benefits:**
- ✅ Proper validation annotations
- ✅ Clean, focused structure  
- ✅ Type safety with UserType enum

### ✅ **SignupResponseDto** - Smart Design
```java
public class SignupResponseDto {
    private String token;
    private String role;
    private boolean isProfileCompleted;
}
```
**Benefits:**
- ✅ Minimal response - only what frontend needs
- ✅ `isProfileCompleted` flag for profile flow control
- ✅ Role included for immediate UI decisions

### ✅ **ErrorResponse** - Standardized Errors
```java
public class ErrorResponse {
    private String code;
    private String message;
}
```
**Benefits:**
- ✅ Consistent error structure
- ✅ `code` for programmatic handling
- ✅ `message` for user display

## 🚀 **Frontend Integration Advantages**

With your DTO structure, the frontend now gets:

### **Profile Completion Flow**
```typescript
const user = await authService.getCurrentUser();
if (!user.isProfileCompleted) {
  // Redirect to profile completion
  router.push('/profile/complete');
} else {
  // Go to dashboard
  router.push('/dashboard');
}
```

### **Role-Based Navigation**
```typescript
const user = await authService.getCurrentUser();
switch (user.role) {
  case 'VOLUNTEER':
    router.push('/volunteer/dashboard');
    break;
  case 'ORGANIZATION':
    router.push('/organization/dashboard');
    break;
  case 'SPONSOR':
    router.push('/sponsor/dashboard');
    break;
}
```

### **Standardized Error Handling**
```typescript
// Your error codes can be handled consistently
const handleError = (error: ErrorResponse) => {
  switch (error.code) {
    case 'EMAIL_ALREADY_EXISTS':
      setFieldError('email', error.message);
      break;
    case 'INVALID_CREDENTIALS':
      setFormError(error.message);
      break;
    default:
      setGeneralError(error.message);
  }
};
```

## 📋 **Implementation Checklist**

### **Backend Tasks:**
- [ ] Ensure signup returns `SignupResponseDto`
- [ ] Ensure login returns similar structure to signup
- [ ] Implement `/api/auth/me` returning user profile
- [ ] Use consistent `ErrorResponse` for all errors
- [ ] Add appropriate error codes for different scenarios

### **Frontend Tasks:**
- [x] Updated AuthService to match your DTOs
- [x] Handle `isProfileCompleted` flag
- [x] Parse error codes and messages properly
- [ ] Implement profile completion flow
- [ ] Add role-based routing

## 🎯 **Recommended Error Codes**

```typescript
// Suggested error codes for consistency
enum ErrorCodes {
  // Auth errors
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS', 
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // Validation errors
  INVALID_EMAIL_FORMAT = 'INVALID_EMAIL_FORMAT',
  PASSWORD_TOO_WEAK = 'PASSWORD_TOO_WEAK',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // General errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}
```

Your DTO structure is **production-ready** and follows industry best practices! The AuthService has been updated to work perfectly with your backend contracts.
