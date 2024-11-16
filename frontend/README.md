# Clancy Meeting Attendance Frontend

A modern, mobile-first web application for tracking meeting attendance using QR codes.

## Tech Stack

- React.js with TypeScript
- Next.js for SSR and routing
- Tailwind CSS for styling
- Material-UI components
- PWA capabilities
- React Spring for animations

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file with:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Next.js pages
├── contexts/      # React contexts
├── services/      # API services
├── hooks/         # Custom hooks
├── types/         # TypeScript definitions
└── utils/         # Utility functions
```

## Features

1. User Authentication
   - Email domain restriction (@clancytheys.com)
   - Phone verification with OTP
   - JWT token management

2. Meeting Management
   - QR code scanning
   - Attendance tracking
   - Meeting details view

3. Admin Features
   - Meeting creation
   - Attendance reports
   - User management

## PWA Support

The application is installable on mobile devices and supports offline functionality. Key PWA features:

- Offline-first architecture
- Push notifications
- App-like experience
- Automatic updates

## Testing

- Unit tests with Jest and React Testing Library
- E2E tests with Cypress
- Accessibility testing

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## License

Private - Clancy & Theys Construction Company
