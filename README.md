# ReviewGennie

ReviewGennie is an AI-powered application that summarizes YouTube product reviews using advanced natural language processing. It provides detailed, feature-level breakdowns of products based on comprehensive video analysis.

## Features

- **AI-Powered Summaries**: Generate comprehensive product summaries from YouTube reviews
- **Feature-Level Analysis**: Detailed breakdowns covering Camera, Battery, Design, Performance, and more
- **User Authentication**: Secure sign-in with email/password or OAuth providers (Google & Facebook)
- **Modern UI**: Beautiful, responsive interface built with shadcn-ui and Tailwind CSS
- **Real-time Processing**: Instant analysis using OpenAI's GPT models

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn-ui, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Edge Functions)
- **AI**: OpenAI GPT-4 for content analysis
- **Authentication**: Supabase Auth with OAuth providers
- **Styling**: Tailwind CSS with custom design system

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- OpenAI API key
- Google Cloud Console access (for OAuth)
- Facebook Developers account (for OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ReviewGennie
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the SQL schema from `supabase/schema.sql`
   - Deploy the edge function from `supabase/functions/analyze-product/`

5. **Configure OAuth (Optional)**
   Follow the detailed setup guide in [OAUTH_SETUP.md](./OAUTH_SETUP.md) to enable Google and Facebook sign-in.

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Start the transcript server** (in a separate terminal)
   ```bash
   node youtube-transcript-server.js
   ```

## Usage

1. **Sign In**: Use email/password or OAuth providers to create an account
2. **Search Products**: Enter a product name (e.g., "iPhone 15 Pro")
3. **Get Analysis**: Receive a comprehensive summary with feature breakdowns
4. **Compare Products**: Use the compare feature to analyze multiple products

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn-ui components
│   ├── Header.tsx      # Navigation header
│   ├── ProductCard.tsx # Product display component
│   └── SearchBar.tsx   # Search functionality
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── pages/              # Application pages
│   ├── Auth.tsx        # Sign in/up page
│   ├── Home.tsx        # Main dashboard
│   ├── ProductSummary.tsx # Product analysis results
│   └── Compare.tsx     # Product comparison
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── lib/                # Utility functions
```

## Authentication

ReviewGennie supports multiple authentication methods:

- **Email/Password**: Traditional sign-up and sign-in
- **Google OAuth**: One-click sign-in with Google accounts
- **Facebook OAuth**: One-click sign-in with Facebook accounts

Product analysis is restricted to authenticated users only.

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The app can be deployed to any platform that supports Vite builds:
- Netlify
- Railway
- Render
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the [OAuth Setup Guide](./OAUTH_SETUP.md) for authentication issues
- Review the Supabase documentation for backend configuration
- Open an issue on GitHub for bugs or feature requests
