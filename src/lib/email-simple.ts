import mailchimp from '@mailchimp/mailchimp_marketing';

// Initialize Mailchimp
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY || '',
  server: process.env.MAILCHIMP_SERVER_PREFIX || 'us1',
});

const LIST_ID = process.env.MAILCHIMP_LIST_ID;

export interface WelcomeEmailData {
  name: string;
  email: string;
}

// Simple welcome email - just add user to list and let Mailchimp handle welcome email
export async function sendWelcomeEmail(data: WelcomeEmailData) {
  try {
    if (!LIST_ID) {
      throw new Error('Mailchimp list ID not configured');
    }

    // Simply add the user to the Mailchimp list
    // Mailchimp will automatically send welcome email if configured
    const result = await mailchimp.lists.addListMember(LIST_ID, {
      email_address: data.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: data.name,
        LNAME: '',
      },
    });

    return { 
      success: true, 
      message: 'User added to list successfully',
      memberId: result && typeof result === 'object' && 'id' in result ? (result as { id: string }).id : 'unknown'
    };
  } catch (error: unknown) {
    // If user already exists, that's okay
    if (error && typeof error === 'object' && 'status' in error && error.status === 400 && 'title' in error && error.title === 'Member Exists') {
      return { 
        success: true, 
        message: 'User already exists in list' 
      };
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to add user to list' 
    };
  }
}

// Get subscriber count
export async function getSubscriberCount() {
  try {
    if (!LIST_ID) {
      throw new Error('Mailchimp list ID not configured');
    }

    const response = await mailchimp.lists.getList(LIST_ID);
    return {
      success: true,
      count: response.stats.member_count,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get subscriber count',
      count: 0,
    };
  }
}
