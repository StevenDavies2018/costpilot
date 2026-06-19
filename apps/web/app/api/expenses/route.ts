import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ExpenseSchema = z.object({
  user_id: z.string().uuid(),
  amount: z.number().positive(),
  category: z.string(),
  date: z.string().date(),
  description: z.string().optional(),
  receipt_id: z.string().uuid().optional(),
  is_tax_deductible: z.boolean().default(true),
});

// Create or list expenses
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const expense = ExpenseSchema.parse(body);

    // TODO: Validate expense category matches user's niche
    // TODO: Store in Neon DB
    // TODO: Apply CRA rules for tax deductibility
    // TODO: Update tax summary

    return NextResponse.json(
      {
        success: true,
        expense_id: 'temp-id',
        ...expense,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const user_id = searchParams.get('user_id');
    const month = searchParams.get('month'); // YYYY-MM format

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id required' },
        { status: 400 }
      );
    }

    // TODO: Fetch expenses from Neon DB
    // TODO: Filter by month if provided
    // TODO: Include calculated tax deductions

    return NextResponse.json({
      success: true,
      expenses: [],
      total: 0,
      tax_deductible_total: 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}
