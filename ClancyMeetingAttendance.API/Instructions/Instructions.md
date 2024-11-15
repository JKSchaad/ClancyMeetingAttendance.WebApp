# ClancyMeetingAttendance System
Development Instructions for Windsurf AI

## Project Overview
ClancyMeetingAttendance is a QR code-based meeting attendance tracking system for Clancy & Theys Construction Company. The system allows employees to sign into meetings by scanning QR codes with their mobile devices, with attendance tracking and management handled through an administrative interface.

## Solution Structure
The solution follows Clean Architecture principles with the following projects:
```
ClancyMeetingAttendance/
├── src/
│   ├── ClancyMeetingAttendance.API        # ASP.NET Core Web API
│   ├── ClancyMeetingAttendance.Core       # Domain models and interfaces
│   └── ClancyMeetingAttendance.Infrastructure  # Data access and external services
└── tests/
    └── ClancyMeetingAttendance.Tests      # Unit and integration tests
```

## Key Features

### 1. User Authentication System
- Email domain restriction to @clancytheys.com
- Phone number verification using OTP via Twilio
- JWT-based authentication
- Role-based authorization (Admin/User)

### 2. Meeting Management
- Create/Edit/Delete meetings
- Generate unique QR codes for each meeting
- Track attendance
- Export attendance reports

### 3. Mobile-First User Interface
- Progressive Web App (PWA)
- QR code scanning capability
- Responsive design
- Offline support

## Technical Requirements

### Backend (.NET 8)
- Implement Repository Pattern
- Use Entity Framework Core with SQL Server
- Implement CQRS pattern where appropriate
- Use Azure Key Vault for secrets
- Implement proper exception handling and logging

### Database Design
```sql
-- Key Tables and Relationships
Users
- Id (PK)
- FirstName
- LastName
- Email (@clancytheys.com)
- PhoneNumber
- IsAdmin
- CreatedAt

Meetings
- Id (PK)
- Title
- Description
- Location
- StartTime
- EndTime
- CreatedById (FK to Users)
- QRCodeUrl

Attendances
- Id (PK)
- UserId (FK to Users)
- MeetingId (FK to Meetings)
- SignInTime
- DeviceInfo
```

### API Endpoints

#### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/request-otp
- POST /api/auth/verify-otp

#### Meetings
- GET /api/meetings
- GET /api/meetings/{id}
- POST /api/meetings
- PUT /api/meetings/{id}
- DELETE /api/meetings/{id}
- GET /api/meetings/{id}/attendance
- POST /api/meetings/{id}/sign-in

#### Users
- GET /api/users
- GET /api/users/{id}
- PUT /api/users/{id}
- DELETE /api/users/{id}

#### Admin
- GET /api/admin/reports/attendance
- GET /api/admin/reports/meetings
- GET /api/admin/users/manage

### Security Requirements
1. Authentication & Authorization
   - JWT tokens with 1-hour expiry
   - Refresh token mechanism
   - Role-based access control
   - Phone verification required for sign-in

2. Data Protection
   - All API endpoints must be HTTPS
   - Implement rate limiting
   - Encrypt sensitive data at rest
   - Proper password hashing (use ASP.NET Core Identity)

3. Input Validation
   - Validate email domain
   - Sanitize all inputs
   - Validate phone numbers
   - Implement request size limits

### User Flows

#### New User Registration
1. Scan meeting QR code
2. Redirect to registration page
3. Enter details (name, email, phone)
4. Verify phone via OTP
5. Create account
6. Automatic sign-in to meeting

#### Existing User Sign-in
1. Scan meeting QR code
2. Enter phone number
3. Receive OTP
4. Enter OTP
5. Record attendance

#### Admin Meeting Creation
1. Login to admin portal
2. Create new meeting
3. Set meeting details
4. Generate QR code
5. Share QR code

## Implementation Guidelines

### 1. Database
- Use EF Core Code-First approach
- Implement proper indexing
- Include audit trails
- Setup proper cascade deletes

### 2. API Development
- Implement versioning
- Use DTOs for data transfer
- Implement proper model validation
- Use async/await throughout

### 3. Security
- Implement proper CORS policy
- Use HTTPS everywhere
- Implement proper authentication
- Setup proper authorization

### 4. Error Handling
- Implement global exception handling
- Proper logging
- User-friendly error messages
- Validation error handling

### 5. Performance
- Implement caching where appropriate
- Optimize database queries
- Implement pagination
- Monitor API performance

## Testing Requirements
- Unit tests for business logic
- Integration tests for API endpoints
- Load testing for concurrent users
- Security testing

## Deployment Considerations
- Azure Web Apps deployment
- Azure SQL Database
- Azure Key Vault for secrets
- Application Insights for monitoring

## Code Generation Instructions

1. Start with Core project:
   - Generate domain entities
   - Create interfaces
   - Setup DTOs
   - Define exceptions

2. Infrastructure project:
   - Implement DbContext
   - Create repositories
   - Setup external services
   - Implement interfaces

3. API project:
   - Generate controllers
   - Setup middleware
   - Implement authentication
   - Create API endpoints

4. Testing:
   - Generate unit tests
   - Create integration tests
   - Setup test data

## Important Notes
1. All API responses should follow standard format:
```json
{
  "success": boolean,
  "data": object | null,
  "message": string | null,
  "errors": array | null
}
```

2. Validation Rules:
   - Email must end with @clancytheys.com
   - Phone numbers must be US format
   - Passwords must meet complexity requirements
   - Meeting titles must be unique per day

3. QR Code Format:
   - URL format: https://meetings.clancytheys.com/signin/{meetingId}
   - Include error correction
   - Optimize for mobile scanning

4. Rate Limiting:
   - OTP requests: 3 per 15 minutes
   - API calls: 100 per minute per user
   - Failed login attempts: 5 per 15 minutes

## Dependencies to Install

### API Project
```xml
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
<PackageReference Include="QRCoder" Version="1.4.3" />
<PackageReference Include="Twilio" Version="6.15.1" />
```

### Core Project
```xml
<PackageReference Include="Microsoft.Extensions.DependencyInjection.Abstractions" Version="8.0.0" />
```

### Infrastructure Project
```xml
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="8.0.0" />
```

## Configuration
Use the following configuration structure in appsettings.json:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=...;Database=ClancyMeetingAttendance;..."
  },
  "Jwt": {
    "Issuer": "https://meetings.clancytheys.com",
    "Audience": "https://meetings.clancytheys.com",
    "Key": "your-secret-key-min-256-bits",
    "ExpiryInMinutes": 60
  },
  "Twilio": {
    "AccountSid": "your-account-sid",
    "AuthToken": "your-auth-token",
    "FromNumber": "your-twilio-number"
  }
}
```

## Next Steps
1. Generate all entities and DbContext
2. Implement authentication system
3. Create basic API endpoints
4. Setup admin features
5. Implement QR code generation
6. Add SMS functionality
7. Create tests
8. Setup deployment pipeline

Remember to:
- Follow C# coding conventions
- Use async/await throughout
- Implement proper error handling
- Add appropriate logging
- Document all public APIs
- Validate all inputs
- Secure all endpoints
- Add appropriate tests

Please proceed with code generation following these specifications. Let me know if you need any clarification or additional details.