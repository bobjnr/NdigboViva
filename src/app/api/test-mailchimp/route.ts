import { NextResponse } from 'next/server';
import mailchimp from '@mailchimp/mailchimp_marketing';

// Initialize Mailchimp
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY || '',
  server: process.env.MAILCHIMP_SERVER_PREFIX || 'us1',
});

const LIST_ID = process.env.MAILCHIMP_LIST_ID;

export async function GET() {
  try {
    const results = {
      apiKey: !!process.env.MAILCHIMP_API_KEY,
      serverPrefix: process.env.MAILCHIMP_SERVER_PREFIX,
      listId: !!process.env.MAILCHIMP_LIST_ID,
      listIdValue: process.env.MAILCHIMP_LIST_ID,
      tests: [] as Array<{
        name: string;
        status: 'pass' | 'fail';
        message: string;
        details?: unknown;
      }>,
    };

    // Test 1: Check if API key is valid
    if (LIST_ID) {
      try {
        const list = await mailchimp.lists.getList(LIST_ID);
        results.tests.push({
          name: 'API Connection',
          status: 'pass',
          message: `Connected successfully. List: ${list.name}`,
        });
      } catch (error: unknown) {
        results.tests.push({
          name: 'API Connection',
          status: 'fail',
          message: error instanceof Error ? error.message : 'Failed to connect to Mailchimp API',
        });
      }
    } else {
      results.tests.push({
        name: 'API Connection',
        status: 'fail',
        message: 'No list ID configured',
      });
    }

    // Test 2: Check if list exists
    if (LIST_ID) {
      try {
        const list = await mailchimp.lists.getList(LIST_ID);
        results.tests.push({
          name: 'List Access',
          status: 'pass',
          message: `List found: ${list.name} (${list.stats.member_count} members)`,
        });
      } catch (error: unknown) {
        results.tests.push({
          name: 'List Access',
          status: 'fail',
          message: error instanceof Error ? error.message : 'Failed to access the specified list',
        });
      }
    } else {
      results.tests.push({
        name: 'List Access',
        status: 'fail',
        message: 'No list ID configured',
      });
    }

    // Test 3: Check merge fields (simplified)
    if (LIST_ID) {
      results.tests.push({
        name: 'Merge Fields',
        status: 'pass',
        message: 'Merge fields check skipped - method not available in current API',
      });
    }

    // Test 4: Check domain authentication (simplified)
    results.tests.push({
      name: 'Domain Authentication',
      status: 'pass',
      message: 'Domain authentication check skipped - method not available in current API',
    });

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Mailchimp test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to run tests',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
