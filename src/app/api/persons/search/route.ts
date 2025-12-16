/**
 * API Route: Search Persons
 * GET /api/persons/search?q={searchTerm}&type={name|location|diaspora}
 * 
 * Searches for person records by various criteria
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  searchPersonsByName, 
  getPersonsByLocation, 
  getDiasporaPersons 
} from '@/lib/person-database';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchType = searchParams.get('type') || 'name';
    const query = searchParams.get('q') || '';
    
    let results = [];
    
    switch (searchType) {
      case 'name':
        if (!query) {
          return NextResponse.json(
            { success: false, error: 'Search query is required' },
            { status: 400 }
          );
        }
        results = await searchPersonsByName(query);
        break;
        
      case 'location':
        const state = searchParams.get('state') || undefined;
        const lga = searchParams.get('lga') || undefined;
        const town = searchParams.get('town') || undefined;
        const village = searchParams.get('village') || undefined;
        const umunna = searchParams.get('umunna') || undefined;
        
        results = await getPersonsByLocation({ state, lga, town, village, umunna });
        break;
        
      case 'diaspora':
        const country = searchParams.get('country') || undefined;
        results = await getDiasporaPersons(country);
        break;
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid search type' },
          { status: 400 }
        );
    }
    
    return NextResponse.json({
      success: true,
      count: results.length,
      results
    });
    
  } catch (error) {
    console.error('Error searching persons:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}

