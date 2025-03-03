# Booth Reports: Product Requirements Document

## 1. Elevator Pitch
Booth Reports is a streamlined community app that connects residents with their area president, allowing them to report neighborhood issues such as potholes, streetlights, drainage, and garbage problems. The app features phone verification for secure access, enables residents to track their own complaints, and provides area presidents with a comprehensive admin dashboard to manage and resolve community issues efficiently.

## 2. Who is this app for
- **Primary Users:** Residents/neighbors in a local community who need to report infrastructure or maintenance issues
- **Secondary Users:** Area presidents (admins) who need to track, respond to, and resolve reported issues
- **Target Demographic:** Community members of all technical ability levels who want a simple way to communicate problems
admin power should be given by me. i am elite 

## 3. Functional Requirements

### User Authentication
- User registration with name, phone number, and password
- Phone verification via one-time password (OTP)
- Secure login system
- Password recovery functionality

### Resident Features
- Submit complaints in predefined categories:
  - Potholes
  - Streetlights
  - Drainage
  - Garbage problems
- Optional photo uploads for visual documentation of issues
- google map location.
- Track status of personal complaints
- View response messages from the area president
- View history of personal complaints

### Admin Features
- Comprehensive dashboard showing all submitted complaints
- Filter and sort complaints by category, status, and date
- Reply to individual complaints
- Update status of complaints
- View complaint resolution statistics
- Manage user accounts

### Technical Requirements
- Responsive design for mobile and desktop usage
- Next.js frontend implementation
- Database for storing user data and complaints (using supabase )
- Secure API for data exchange
- OTP generation and verification system

## 4. User Stories

### As a Resident
1. "I want to create an account so that I can report neighborhood issues."
   - User provides name, phone number, and creates a password
   - User receives and enters OTP to verify phone number
   - User gains access to the complaint submission system

2. "I want to report a pothole on my street so that it can be fixed."
   - User selects "Pothole" from predefined categories
   - User describes the location and severity of the issue
   - User optionally uploads a photo of the pothole
   - User submits the complaint and receives confirmation

3. "I want to check if my reported streetlight issue is being addressed."
   - User navigates to "My Reports" section
   - User views status of their streetlight complaint
   - User reads any responses from the area president

### As an Area President
1. "I want to see all community complaints in one place so I can prioritize issues."
   - Admin logs into dashboard
   - Admin views list of all submitted complaints
   - Admin filters by category to focus on specific issue types

2. "I want to respond to a resident about their drainage problem."
   - Admin selects specific complaint
   - Admin writes and sends a response
   - System notifies resident of the response

3. "I want to update the status of resolved issues."
   - Admin identifies complaints that have been addressed
   - Admin updates the status accordingly
   - System notifies residents of status changes

## 5. User Interface

### Resident Interface

#### Login/Registration Screen
- Clean, simple form with fields for:
  - Name (registration only)
  - Phone number
  - Password
- "Register" and "Login" buttons
- OTP verification screen with numeric input field

#### Home Screen
- Welcome message with user's name
- Large, clearly labeled buttons for each complaint category
- "My Reports" button to view personal complaint history

#### Complaint Submission Form
- Category selection (pre-filled based on selection from home screen)
- Description text area
- Location field
- Photo upload button (optional)
- Submit button

#### My Reports Screen
- List of personal complaints with:
  - Category icon
  - Brief description
  - Submission date
  - Current status
  - Indication of new responses

#### Complaint Detail Screen
- Full complaint details
- Photo (if uploaded)
- Status indicator
- Response messages from area president
- Timestamp of all activities

### Admin Interface

#### Dashboard
- Summary statistics at the top:
  - Total complaints
  - New complaints
  - Resolved complaints
- Category breakdown chart
- Recent complaints list

#### Complaint Management Screen
- Sortable, filterable table of all complaints
- Quick status update buttons
- Search functionality

#### Complaint Detail Screen
- Complete complaint information
- Resident contact details
- Photo viewing area
- Response composition area
- Status update dropdown
- History of all interactions

#### User Management Screen
- List of registered users
- Basic account management functions








```
<think>You're right, I shouldn't compromise on the strong authentication requirement mentioned in the initial requirements. Let me adjust the routing structure to ensure we maintain strong authentication while keeping the structure simple:

1. For authentication flow:
   - We need to keep the verification flow separate from registration
   - We should include the verify page for OTP verification 
   - The reset password flow should be complete

2. For protection:
   - We'll use Next.js middleware for route protection
   - Authentication logic will be separate from the routing structure

So let me update the structure while maintaining strong authentication.</think>You're right. Here's the updated routing structure with strong authentication intact:

```
app/
├── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── verify/page.tsx
│   └── reset-password/page.tsx
│
├── (protected)/
│   ├── layout.tsx                    # Protected layout with auth check
│   │
│   ├── dashboard/                    # Resident home page
│   │   └── page.tsx
│   │
│   ├── complaints/
│   │   ├── page.tsx                  # My reports list
│   │   ├── [id]/page.tsx             # Individual complaint view
│   │   └── new/                      # New complaint submission
│   │       ├── page.tsx              # General submission form
│   │       ├── pothole/page.tsx
│   │       ├── streetlight/page.tsx
│   │       ├── drainage/page.tsx
│   │       └── garbage/page.tsx
│   │
│   └── profile/
│       └── page.tsx                  # User profile management
│
├── (admin)/
│   ├── layout.tsx                    # Admin layout with admin check
│   │
│   ├── admin/                        # Admin routes
│   │   ├── dashboard/page.tsx        # Admin dashboard
│   │   │
│   │   ├── complaints/
│   │   │   ├── page.tsx              # All complaints list
│   │   │   └── [id]/page.tsx         # Admin complaint detail view
│   │   │
│   │   └── users/
│   │       └── page.tsx              # User management
│
├── api/                              # API routes
├── layout.tsx                        # Root layout (theme setup)
└── page.tsx                          # Landing page
```

This structure:
- Maintains complete authentication flow including OTP verification
- Uses middleware for protecting routes based on auth status and roles
- Keeps the routing relatively flat while preserving all functionality
- Separates admin complaint detail view for more extensive management features

