<div align="center">
<img width="1200" height="475" alt="Gatherly Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Gatherly - AI-Powered Event Management Platform

Gatherly is a modern event management application that helps users discover, create, and attend events in their community. It features AI-powered recommendations using the Gemini API and a full-stack architecture with React, Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Secure user registration and login with JWT tokens
- **Event Discovery**: Browse and search for events by category, date, and location
- **Event Management**: Create, update, and manage events as an organizer
- **AI Recommendations**: Get personalized event recommendations powered by Google Gemini AI
- **User Profiles**: Manage your profile, interests, and event history
- **Event Analytics**: View event statistics and attendee information
- **Responsive Design**: Modern UI built with React, Tailwind CSS, and Framer Motion

## Tech Stack

**Frontend:**
- React 19
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Recharts (analytics)

**Backend:**
- Node.js
- Express
- MongoDB (with Mongoose)
- JWT for authentication
- Bcrypt for password hashing

**AI Integration:**
- Google Gemini API
- @google/genai SDK

## Prerequisites

- Node.js (v16 or higher)
- MongoDB connection string
- Google Gemini API key

## Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gatherly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env.local`
   - Update the following variables in `.env.local`:
     ```
     GEMINI_API_KEY=your_gemini_api_key_here
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     APP_URL=http://localhost:5173
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run start` - Start the server
- `npm run clean` - Remove build artifacts
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/        # Reusable React components
├── pages/            # Page components
├── hooks/            # Custom React hooks
├── services/         # API services (including AI service)
├── lib/              # Utility functions
└── App.jsx           # Main app component
```

## API Integration

The application connects to an Express backend server that handles:
- User authentication and authorization
- Event CRUD operations
- MongoDB database operations
- AI-powered event recommendations

## Getting an API Key

To use the AI features, you'll need a Google Gemini API key:
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file as `GEMINI_API_KEY`

## Development

For development with hot module replacement:
```bash
npm run dev
```

For building a production-ready bundle:
```bash
npm run build
```

## License

[Add your license information here]

## Contributing

[Add contribution guidelines here]

## Support

For issues and questions, please open an issue on the repository.
