import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Onboarding endpoint - niche selection and initial setup
const OnboardingSchema = z.object({
  user_id: z.string().uuid(),
  niche: z.enum(['contractor', 'real_estate_agent', 'other']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, niche } = OnboardingSchema.parse(body);

    // TODO: Update user niche in DB
    // TODO: Initialize niche-specific settings
    // TODO: Pre-populate categories based on niche
    // TODO: Set up CRA compliance rules

    return NextResponse.json(
      {
        success: true,
        message: `User onboarded as ${niche}`,
        config: {
          niche,
          categories: [], // Will be populated based on niche
          tax_rules: {}, // Will include CRA-specific deductions
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Onboarding failed' },
      { status: 400 }
    );
  }
}
