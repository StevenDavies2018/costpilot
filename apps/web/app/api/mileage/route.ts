import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const MileageSchema = z.object({
  user_id: z.string().uuid(),
  date: z.string().date(),
  kilometers: z.number().positive(),
  purpose: z.string().optional(),
});

// Create or list mileage entries
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const mileage = MileageSchema.parse(body);

    // TODO: Store in Neon DB
    // TODO: Calculate CRA deduction (currently ~$0.70/km)
    // TODO: Update tax summary with mileage deductions

    return NextResponse.json(
      {
        success: true,
        mileage_id: 'temp-id',
        ...mileage,
        deduction: mileage.kilometers * 0.70, // CRA standard rate
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create mileage entry' },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const user_id = searchParams.get('user_id');
    const year = searchParams.get('year');

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id required' },
        { status: 400 }
      );
    }

    // TODO: Fetch mileage entries from Neon DB
    // TODO: Calculate total km and deductions for the year
    // TODO: Return by month or date range

    return NextResponse.json({
      success: true,
      mileage_entries: [],
      total_kilometers: 0,
      total_deduction: 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch mileage' },
      { status: 500 }
    );
  }
}
