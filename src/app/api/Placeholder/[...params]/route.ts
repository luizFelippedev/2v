// app/api/placeholder/[...dimensions]/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { dimensions: string[] } }
) {
  try {
    const { dimensions } = params;
    
    // Parse dimensions from URL params
    const [widthStr, heightStr] = dimensions;
    const width = parseInt(widthStr) || 400;
    const height = parseInt(heightStr) || 300;
    
    // Validate dimensions (reasonable limits)
    if (width < 1 || width > 2000 || height < 1 || height > 2000) {
      return NextResponse.json(
        { error: 'Invalid dimensions. Width and height must be between 1 and 2000.' },
        { status: 400 }
      );
    }
    
    // Generate SVG placeholder
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <rect x="2" y="2" width="${width - 4}" height="${height - 4}" fill="none" stroke="#e5e7eb" stroke-width="2" stroke-dasharray="5,5"/>
        <text x="50%" y="50%" font-family="system-ui, sans-serif" font-size="16" fill="#6b7280" text-anchor="middle" dy=".3em">
          ${width} × ${height}
        </text>
      </svg>
    `;
    
    // Return SVG with proper headers
    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Placeholder API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}