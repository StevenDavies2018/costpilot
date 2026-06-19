# CostPilot OAuth Setup Guide - Web Backend

Configure Google, Facebook, and LinkedIn OAuth for the **web backend** (Next.js on Vercel).

> **For Android app OAuth setup**, see [`ANDROID-OAUTH-SETUP.md`](./ANDROID-OAUTH-SETUP.md)  
> **For iOS app OAuth setup**, see [`IOS-OAUTH-SETUP.md`](./IOS-OAUTH-SETUP.md) (coming soon)

## Overview

You'll need OAuth credentials from 3 providers. Each requires:
- Creating an application
- Setting redirect URIs
- Copying credentials to `.env.local`

---

## 1. Google OAuth

### Step 1: Create Google Cloud Project

1. Go to **Google Cloud Console**: https://console.cloud.google.com
2. Click the **Project** dropdown at the top
3. Click **NEW PROJECT**
   - Name: `CostPilot`
   - Click **CREATE**
4. Wait for the project to be created (may take a minute)

### Step 2: Enable Google+ API

1. In the left sidebar, click **APIs & Services** → **Library**
2. Search for **"Google+ API"**
3. Click on it
4. Click **ENABLE**

### Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials** (left sidebar)
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. You'll see a warning: **"You need to configure the OAuth consent screen first"**
4. Click **CONFIGURE CONSENT SCREEN**

### Step 4: Configure OAuth Consent Screen

1. Choose **External** (for testing)
2. Click **CREATE**
3. Fill in the form:
   - **App name**: CostPilot
   - **User support email**: your-email@gmail.com
   - **Developer contact**: your-email@gmail.com
4. Click **SAVE AND CONTINUE**
5. On "Scopes" page: Click **SAVE AND CONTINUE** (defaults are fine)
6. On "Test users" page: Click **SAVE AND CONTINUE**
7. Review and click **BACK TO DASHBOARD**

### Step 5: Create OAuth Client ID

1. Go back to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Choose **Web application**
4. Name: `CostPilot Web`
5. Add **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   https://costpilot.vercel.app/api/auth/callback/google
   ```
6. Click **CREATE**
7. Copy the credentials:
   - **Client ID** → `GOOGLE_CLIENT_ID`
   - **Client Secret** → `GOOGLE_CLIENT_SECRET`

---

## 2. Facebook OAuth

### Step 1: Create Facebook App

1. Go to **Facebook Developers**: https://developers.facebook.com
2. Click **My Apps** (top right)
3. Click **+ Create App**
4. Choose **Consumer** (for user login)
5. Fill in details:
   - **App Name**: CostPilot
   - **App Contact Email**: your-email@gmail.com
   - **App Purpose**: Select `Apps for Pages`, `Apps for Websites`, or similar
6. Click **Create App**
7. Verify your identity if prompted

### Step 2: Add Facebook Login Product

1. In your app dashboard, click **+ Add Product**
2. Find **Facebook Login** and click **Set Up**
3. Choose **Web**
4. For "Where is your app hosted?", select your domain (or use `localhost` for testing)

### Step 3: Configure OAuth Redirect URIs

1. Go to **Settings** → **Basic** (left sidebar under Facebook Login)
2. Copy your **App ID** → `FACEBOOK_APP_ID`
3. Copy your **App Secret** → `FACEBOOK_APP_SECRET`
4. Go to **Facebook Login** → **Settings** (left sidebar)
5. Add **Valid OAuth Redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/facebook
   https://costpilot.vercel.app/api/auth/callback/facebook
   ```
6. Click **Save Changes**

---

## 3. LinkedIn OAuth

### Step 1: Create LinkedIn App

1. Go to **LinkedIn Developers**: https://www.linkedin.com/developers
2. Click **Create app** (top right)
3. Fill in the form:
   - **App name**: CostPilot
   - **LinkedIn Page**: (You may need to create one first. Use your personal profile for testing)
   - **App logo**: (Optional, skip for now)
   - **Legal agreement**: Accept and create app
4. Click **Create app**

### Step 2: Get Credentials

1. Go to the **Auth** tab
2. Copy credentials:
   - **Client ID** → `LINKEDIN_CLIENT_ID`
   - **Client secret** → `LINKEDIN_CLIENT_SECRET`

### Step 3: Configure Redirect URIs

1. Still in **Auth** tab, find **Authorized redirect URLs for your app**
2. Click **Add redirect URL**
3. Add both:
   ```
   http://localhost:3000/api/auth/callback/linkedin
   https://costpilot.vercel.app/api/auth/callback/linkedin
   ```
4. Click **Update**

---

## 4. Update `.env.local`

Now update your `.env.local` file with all credentials:

```bash
# Database
DATABASE_URL=postgresql://neondb_owner:npg_p05ZPRvHndLs@ep-steep-thunder-ats5obhv-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# OAuth - Google
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# OAuth - Facebook
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here

# OAuth - LinkedIn
LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here

# Session/Auth
JWT_SECRET=your-random-secret-key-here-min-32-chars-long-for-production

# URLs (update when deployed)
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Generate JWT Secret

```bash
# Run in terminal to generate a random secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 5. Test OAuth Locally

### Start the development server:

```bash
pnpm dev:web
# Runs on http://localhost:3000
```

### Test each provider:

1. Navigate to `http://localhost:3000`
2. Click "Sign in with Google" (when you implement the UI)
3. You should be redirected to Google's login
4. After login, you'll be redirected back to `http://localhost:3000/api/auth/callback/google`

---

## 6. Deployment to Vercel

### Update Environment Variables

When you're ready to deploy:

1. Push your code to GitHub
2. Go to **Vercel Dashboard**: https://vercel.com/dashboard
3. Import your `costpilot` repository
4. Add environment variables:
   - `DATABASE_URL` (your Neon connection string)
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`
   - `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`
   - `JWT_SECRET` (use a new secure random value)
   - `NEXT_PUBLIC_API_URL=https://costpilot.vercel.app`
   - `NEXT_PUBLIC_APP_URL=https://costpilot.vercel.app`

### Update OAuth Redirect URIs

After you get your Vercel domain:
- Update each OAuth provider with your production redirect URL: `https://your-vercel-domain.vercel.app/api/auth/callback/{provider}`

---

## Troubleshooting

### "Redirect URI mismatch"
- Check that your redirect URL in the OAuth provider matches exactly what your app expects
- Include `http://` or `https://` and the full path

### "Invalid Client ID"
- Make sure you copied the entire credential
- Check for extra spaces or quotes in `.env.local`
- Restart your dev server after updating `.env.local`

### "401 Unauthorized"
- Verify the Client Secret is correct
- Check that the app hasn't been deleted or regenerated
- Make sure the app is in "Live" mode (not development mode for Facebook)

---

## Next Steps

1. ✅ Create Google, Facebook, LinkedIn apps
2. ✅ Update `.env.local` with credentials
3. **Implement OAuth routes** in `apps/web/app/api/auth/callback/[provider]/route.ts`
4. **Build login UI** (web & iOS)
5. **Deploy to Vercel**

Once you have the credentials, let me know and I can help implement the OAuth callback handlers!
