import { NextRequest, NextResponse } from 'next/server';

// Google OAuth callback handler
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code received' },
      { status: 400 }
    );
  }

  try {
    // TODO: Exchange code for tokens
    // TODO: Verify state parameter
    // TODO: Fetch user info from Google
    // TODO: Create/update user in DB
    // TODO: Generate session token

    return NextResponse.json({
      success: true,
      message: 'OAuth callback received. Implementation coming soon.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'OAuth callback failed' },
      { status: 500 }
    );
  }
}
