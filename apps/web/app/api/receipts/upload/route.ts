import { NextRequest, NextResponse } from 'next/server';

// Receipt upload and OCR processing
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const user_id = formData.get('user_id') as string;

    if (!file || !user_id) {
      return NextResponse.json(
        { error: 'Missing file or user_id' },
        { status: 400 }
      );
    }

    // TODO: Store image in cloud storage (Vercel Blob or similar)
    // TODO: Run OCR on image using Tesseract.js or cloud API
    // TODO: Extract vendor, amount, date, items
    // TODO: Store receipt metadata in Neon DB
    // TODO: Return extracted data for user review

    return NextResponse.json(
      {
        success: true,
        message: 'Receipt uploaded. OCR processing coming soon.',
        receipt_id: 'temp-id',
        extracted_data: {
          vendor: '',
          amount: 0,
          date: '',
          items: [],
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
