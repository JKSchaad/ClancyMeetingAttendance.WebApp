# Frontend Development Instructions

## Technology Stack
- React.js with TypeScript
- Tailwind CSS for styling
- PWA (Progressive Web App) capabilities
- QR Code scanning using `react-qr-reader`
- Axios for API communication

## Project Structure
```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts (auth, etc.)
│   ├── services/          # API services
│   ├── hooks/             # Custom hooks
│   ├── types/             # TypeScript definitions
│   └── utils/             # Utility functions
```

## Key Components

### 1. Mobile User Interface

#### QR Scanner Component
- Full-screen camera view
- Overlay for scanning guidance
- Error handling for camera permissions
- Loading states
- Success/failure feedback

#### Registration Form
- Input fields:
  - First Name
  - Last Name
  - Email (@clancytheys.com validation)
  - Phone Number (with formatting)
- Form validation
- Error messaging
- Loading states

#### OTP Verification
- 6-digit input field
- Countdown timer for resend
- Clear error messaging
- Success confirmation

#### Meeting Sign-in
- Meeting details display
- Confirmation screen
- Success/failure feedback
- Offline capability

### 2. Admin Portal

#### Dashboard
- Meeting statistics
- Recent activity
- Quick actions menu
- Responsive grid layout

#### Meeting Management
- Meeting creation form
- Meeting list with filters
- QR code generation
- Sharing capabilities
- Calendar integration

#### Attendance Reports
- Filterable data table
- Export functionality
- Visual charts/graphs
- Date range selection

#### User Management
- User list with search
- Role management
- Account status controls
- Bulk actions

## Design Guidelines

### Colors
```css
--primary: #1E40AF;     /* Clancy Blue */
--secondary: #059669;   /* Success Green */
--accent: #DC2626;      /* Alert Red */
--background: #F3F4F6;
--text: #111827;
```

### Typography
- Font Family: Inter
- Sizes:
  - Headings: 24px, 20px, 18px
  - Body: 16px
  - Small: 14px

### Spacing
- Base unit: 4px
- Common spacing: 16px, 24px, 32px
- Container padding: 24px

### Responsive Breakpoints
```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

## Component Library
- Use Material-UI (MUI) components
- Custom themed to match brand
- Consistent across application

## PWA Requirements
- Offline-first architecture
- Service worker setup
- Cache strategies
- App manifest
- Install prompts

## State Management
- React Context for global state
- Local storage for persistence
- Redux for complex state (optional)

## API Integration
- Axios instances
- Request/response interceptors
- Error handling
- Loading states
- Retry logic

## Security
- JWT token management
- Secure storage
- XSS prevention
- CORS handling

## Performance
- Code splitting
- Lazy loading
- Image optimization
- Bundle size monitoring
- Performance metrics

## Testing
- Jest for unit tests
- React Testing Library
- E2E with Cypress
- Accessibility testing

## Build & Deployment
- Webpack configuration
- Environment variables
- Build optimization
- Deployment scripts

## Accessibility
- WCAG 2.1 compliance
- Keyboard navigation
- Screen reader support
- Color contrast
- Focus management

## Error Handling
- Error boundaries
- Fallback UI
- Offline detection
- Network error handling

## Animation Guidelines
- Use React Spring
- Subtle transitions
- Loading skeletons
- Progress indicators

## Code Quality
- ESLint configuration
- Prettier setup
- TypeScript strict mode
- Code review guidelines

## Documentation
- Component documentation
- API integration docs
- Setup instructions
- Deployment guide
