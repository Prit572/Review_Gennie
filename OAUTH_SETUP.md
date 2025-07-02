# OAuth Setup Guide for ReviewGennie

This guide will help you set up Google and Facebook OAuth providers in Supabase for the ReviewGennie application.

## Prerequisites

- A Supabase project
- Access to Google Cloud Console
- Access to Facebook Developers Console

## Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application" as the application type
   - Add authorized redirect URIs:
     - `https://your-project-ref.supabase.co/auth/v1/callback`
     - `http://localhost:54321/auth/v1/callback` (for local development)
   - Copy the Client ID and Client Secret

### Step 2: Configure Google Provider in Supabase

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Providers"
3. Find "Google" in the list and click "Edit"
4. Enable the provider by toggling the switch
5. Enter your Google OAuth credentials:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
6. Save the configuration

## Facebook OAuth Setup

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" > "Create App"
3. Choose "Consumer" as the app type
4. Fill in the app details and create the app

### Step 2: Configure Facebook Login

1. In your Facebook app dashboard, go to "Add Product"
2. Find "Facebook Login" and click "Set Up"
3. Choose "Web" as the platform
4. Add your site URL: `https://your-project-ref.supabase.co`
5. Add OAuth redirect URIs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
   - `http://localhost:54321/auth/v1/callback` (for local development)
6. Go to "Facebook Login" > "Settings"
7. Add your domain to "Valid OAuth Redirect URIs"
8. Copy the App ID and App Secret

### Step 3: Configure Facebook Provider in Supabase

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "Providers"
3. Find "Facebook" in the list and click "Edit"
4. Enable the provider by toggling the switch
5. Enter your Facebook OAuth credentials:
   - **Client ID**: Your Facebook App ID
   - **Client Secret**: Your Facebook App Secret
6. Save the configuration

## Environment Variables

Make sure your environment variables are properly configured:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Testing OAuth

1. Start your development server: `npm run dev`
2. Navigate to the auth page
3. Click on "Continue with Google" or "Continue with Facebook"
4. Complete the OAuth flow
5. You should be redirected back to your app and signed in

## Troubleshooting

### Common Issues

1. **Redirect URI Mismatch**: Ensure the redirect URIs in your OAuth provider settings exactly match the ones in Supabase
2. **Domain Verification**: For Facebook, make sure your domain is verified in the Facebook app settings
3. **HTTPS Required**: OAuth providers require HTTPS in production. Use `http://localhost` only for local development

### Google OAuth Issues

- Make sure the Google+ API is enabled
- Verify that your OAuth consent screen is configured
- Check that your app is not in testing mode (or add test users if it is)

### Facebook OAuth Issues

- Ensure your Facebook app is not in development mode for production use
- Add your domain to the app's allowed domains
- Verify that the Facebook Login product is properly configured

## Security Considerations

1. **Client Secrets**: Never expose client secrets in client-side code
2. **Redirect URIs**: Only use trusted redirect URIs
3. **HTTPS**: Always use HTTPS in production
4. **App Review**: For Facebook, you may need to submit your app for review if you plan to publish it

## Production Deployment

When deploying to production:

1. Update redirect URIs in both Google and Facebook console to use your production domain
2. Update the Supabase site URL in your project settings
3. Ensure your production domain is verified in Facebook app settings
4. Test the OAuth flow in production environment

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/) 