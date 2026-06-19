# ExpenseForge Android OAuth Setup (Expo)

Configure Google and LinkedIn OAuth credentials for the Android app (built with Expo).

## Important: Android vs Web OAuth

Android apps require **different OAuth credentials** than web apps because they use:
- **Google**: SHA-1 certificate fingerprint
- **Facebook**: Key hash (derived from signing key)
- **LinkedIn**: Android-specific setup

---

## Step 1: Get Your App's Signing Information

### For Local Development (Debug)

Android creates a debug signing key automatically. You need its SHA-1 fingerprint.

#### Option A: Using Expo (Easiest for development)

```bash
cd D:\ExpenseForge\apps\ios  # (this is your Expo app)
eas credentials
```

This will show your Expo credentials and signing info.

#### Option B: Manual Method

If you have Android SDK installed:

```bash
# For debug key (default):
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Look for the line: "SHA1: XX:XX:XX:XX:..."
```

On Windows, the debug keystore is at:
```
C:\Users\[YourUsername]\.android\debug.keystore
```

#### Option C: Generate EAS Build Credentials

For production, use EAS:

```bash
cd D:\ExpenseForge\apps\ios
eas build --platform android  # This will guide you through credential creation
```

---

## 1. Google OAuth - Android

### Step 1: Go to Google Cloud Console

1. https://console.cloud.google.com
2. Select your **ExpenseForge** project
3. Go to **APIs & Services** → **Credentials**

### Step 2: Create Android OAuth Credential

1. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
2. Choose **Android**
3. Fill in the form:
   - **Package name**: `com.ExpenseForge.app` (or what's in your `app.json`)
   - **SHA-1 certificate fingerprint**: Paste the SHA-1 from your debug key
4. Click **CREATE**
5. Copy the **Client ID** → `GOOGLE_CLIENT_ID_ANDROID`

### Step 3: Verify Package Name in Expo Config

Open `D:\ExpenseForge\apps\ios\app.json`:

```json
{
  "expo": {
    "name": "ExpenseForge",
    "android": {
      "package": "com.ExpenseForge.app"
    },
    "plugins": [
      ["expo-google-sign-in", {
        "androidClientId": "YOUR_GOOGLE_CLIENT_ID_ANDROID"
      }]
    ]
  }
}
```

---

## 2. Facebook OAuth - Android

### Step 1: Go to Facebook App Dashboard

1. https://developers.facebook.com → **My Apps**
2. Select your **ExpenseForge** app
3. Go to **Settings** → **Basic**

### Step 2: Get Key Hash for Android

You need your app's key hash:

```bash
# For debug key:
keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl dgst -sha1 -binary | openssl enc -base64
```

On Windows (PowerShell):
```powershell
$keystore = "$env:USERPROFILE\.android\debug.keystore"
& keytool -exportcert -alias androiddebugkey -keystore $keystore -storepass android | openssl dgst -sha1 -binary | openssl enc -base64
```

### Step 3: Add to Facebook App

1. In Facebook app settings, go to **Products** → **Facebook Login** → **Settings**
2. Under **Android**, add:
   - **Key Hashes**: Paste your key hash from above
   - **Package Name**: `com.ExpenseForge.app`
   - **Class Name**: `com.ExpenseForge.MainActivity` (default for Expo)

### Step 4: Update Expo Config

In `app.json`:

```json
{
  "expo": {
    "plugins": [
      ["react-native-facebook-sdk", {
        "appId": "YOUR_FACEBOOK_APP_ID",
        "clientToken": "YOUR_FACEBOOK_CLIENT_TOKEN",
        "displayName": "ExpenseForge"
      }]
    ]
  }
}
```

Get your **Client Token** from Facebook app **Settings** → **Basic**.

---

---

## Complete app.json Configuration

Update `D:\ExpenseForge\apps\ios\app.json`:

```json
{
  "expo": {
    "name": "ExpenseForge",
    "slug": "ExpenseForge",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "ExpenseForge",
    "userInterfaceStyle": "automatic",
    
    "android": {
      "package": "com.ExpenseForge.app",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundColor": "#FFFFFF"
      },
      "permissions": [
        "INTERNET",
        "ACCESS_NETWORK_STATE"
      ]
    },
    
    "ios": {
      "icon": "./assets/expo.icon",
      "bundleIdentifier": "com.ExpenseForge.app"
    },
    
    "plugins": [
      "expo-router",
      ["expo-google-sign-in", {
        "androidClientId": "YOUR_GOOGLE_CLIENT_ID_ANDROID.apps.googleusercontent.com"
      }],
      ["react-native-facebook-sdk", {
        "appId": "YOUR_FACEBOOK_APP_ID",
        "clientToken": "YOUR_FACEBOOK_CLIENT_TOKEN",
        "displayName": "ExpenseForge"
      }]
    ],
    
    "extra": {
      "eas": {
        "projectId": "YOUR_EAS_PROJECT_ID"
      },
      "linkedInClientId": "YOUR_LINKEDIN_CLIENT_ID"
    }
  }
}
```

---

## Update .env.local for Android

```bash
# Database
DATABASE_URL=your_neon_url

# Web OAuth (for Next.js backend)
GOOGLE_CLIENT_ID=your_web_google_client_id
GOOGLE_CLIENT_SECRET=your_web_google_client_secret

FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Android OAuth (for Expo app)
EXPO_GOOGLE_CLIENT_ID_ANDROID=your_android_google_client_id
EXPO_FACEBOOK_APP_ID_ANDROID=your_facebook_app_id
EXPO_FACEBOOK_CLIENT_TOKEN=your_facebook_client_token
EXPO_LINKEDIN_CLIENT_ID_ANDROID=your_linkedin_client_id

# Session/Auth
JWT_SECRET=your_jwt_secret

# URLs
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Test Android App Locally

### 1. Install EAS CLI

```bash
npm install -g eas-cli
eas login
```

### 2. Run on Android Emulator

```bash
cd D:\ExpenseForge\apps\ios
expo start --android
```

Or build for testing:

```bash
eas build --platform android --profile preview
# This creates an APK you can install on an Android device/emulator
```

### 3. Test OAuth Flow

1. Launch the app on Android emulator
2. Tap "Sign in with Google/Facebook/LinkedIn"
3. You should be redirected to the provider's login
4. After login, redirected back to the app

---

## Troubleshooting

### "Invalid package name"
- Make sure `android.package` in `app.json` matches what you registered with OAuth providers
- Android package names are lowercase: `com.company.appname`

### "SHA-1 mismatch"
- You registered one SHA-1 but the app is signed with a different key
- For debug builds, use your debug keystore SHA-1
- For production, use your release keystore SHA-1 (generate with EAS)

### "Key hash doesn't match" (Facebook)
- Make sure you calculated the hash correctly
- Re-run the `keytool` command and verify the output
- Facebook can take a few minutes to register the hash

### App crashes on OAuth login
- Check that you've installed the OAuth plugin: `expo install expo-google-sign-in`
- Verify credentials in `app.json` are correct
- Check `.env.local` variables are accessible to the app

---

## Next Steps

1. ✅ Get your debug key's SHA-1 fingerprint
2. ✅ Create Android OAuth credentials on each provider
3. ✅ Update `app.json` with credentials
4. **Install OAuth plugins** in Expo app
5. **Implement OAuth UI** in the app
6. **Test on Android emulator**
7. **Deploy to EAS for production builds**

---

## Production Deployment (EAS)

When ready for production:

```bash
cd D:\ExpenseForge\apps\ios
eas build --platform android
# Follow the prompts to create a release signing key
eas submit --platform android
# This submits to Google Play Store
```

Once you build with EAS, update your OAuth credentials with the **production signing key's SHA-1** from EAS.

---

## Resources

- **Expo Authentication**: https://docs.expo.dev/develop/authentication/
- **Google Sign-In**: https://docs.expo.dev/build-reference/google-sign-in/
- **Facebook SDK**: https://docs.expo.dev/build-reference/facebook-sdk/
- **EAS Build**: https://docs.expo.dev/build/introduction/


