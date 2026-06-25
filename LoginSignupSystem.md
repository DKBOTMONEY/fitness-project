# Architecture Overview - Login & Signup System

## System Flow Diagram

```mermaid
graph TD
    A[Homepage] --> B{User Action}
    B -->|New User| C[Signup Page]
    B -->|Existing User| D[Login Page]
    
    C --> E[Enter Gmail]
    E --> F[Enter Password]
    F --> G{Validate Password}
    
    G -->|Invalid| H[Error: Must contain<br/>- Uppercase letter<br/>- Lowercase letter<br/>- Minimum 8 characters]
    H --> F
    
    G -->|Valid| I[Create Account]
    I --> J[Send Verification Email]
    J --> K[Email Sent to Gmail]
    K --> L[User Opens Email]
    L --> M[Click Confirmation Link]
    M --> N[Account Verified]
    N --> O[Welcome! Redirect to Dashboard]
    
    D --> P[Enter Gmail]
    P --> Q[Enter Password]
    Q --> R{Authenticate}
    R -->|Success| O
    R -->|Failed| S[Error: Invalid Credentials]
    S --> D


        Password Requirements
    The password must meet the following criteria:

    Requirement	Details
    Uppercase Letters	At least 1 uppercase letter required (A-Z)
    Lowercase Letters	At least 1 lowercase letter required (a-z)
    Minimum Length	Must be at least 8 characters long
    Valid Password Examples
    Password123
    SecurePass456
    MyP@ss2024
    Invalid Password Examples
    password123 ❌ (no uppercase)
    PASSWORD123 ❌ (no lowercase)
    Pass1 ❌ (less than 8 characters)
    Registration Flow
    User Registration

    User enters Gmail address
    User enters password matching requirements
    System validates input
    Email Verification

    Verification email sent to user's Gmail
    Email contains confirmation link
    User clicks link to verify account
    Account Activation

    Account is marked as verified
    User is redirected to dashboard
    User can now login
    System Components
    Mermaid
    graph LR
        A[Frontend<br/>Login/Signup UI] -->|HTTP/HTTPS| B[Backend API<br/>Authentication]
        B -->|Query| C[(Database<br/>Users)]
        B -->|SMTP| D[Email Service<br/>Gmail]
        C -->|Response| B
        D -->|Verification Link| E[User Gmail<br/>Inbox]
        E -->|Confirm| B
    Security Considerations
    ✅ Password strength validation enforced
    ✅ HTTPS encryption for data transmission
    ✅ Email verification to prevent fake accounts
    ✅ Secure password hashing in database
    ✅ CSRF protection on forms
