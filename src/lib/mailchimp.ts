import mailchimp from '@mailchimp/mailchimp_marketing';
import { createHash } from 'crypto';

// Initialize Mailchimp
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY || '',
  server: process.env.MAILCHIMP_SERVER_PREFIX || 'us1',
});

const LIST_ID = process.env.MAILCHIMP_LIST_ID;

export interface NewsletterSubscriber {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
}

export interface NewsletterCampaign {
  id: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent';
  sendTime?: string;
}

// Subscribe user to newsletter
export async function subscribeToNewsletter(subscriber: NewsletterSubscriber) {
  if (!LIST_ID) {
    throw new Error('Mailchimp list ID not configured');
  }

  try {
    const response = await mailchimp.lists.addListMember(LIST_ID, {
      email_address: subscriber.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: subscriber.firstName || '',
        LNAME: subscriber.lastName || '',
      },
      tags: subscriber.tags || [],
    });

    return {
      success: true,
      data: response,
    };
  } catch (error: unknown) {
    console.error('Mailchimp subscription error:', error);
    
    // Handle specific error cases
    if (error && typeof error === 'object' && 'status' in error && 'title' in error && 
        error.status === 400 && error.title === 'Member Exists') {
      return {
        success: false,
        error: 'This email is already subscribed to our newsletter.',
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to subscribe to newsletter',
    };
  }
}

// Unsubscribe user from newsletter
export async function unsubscribeFromNewsletter(email: string) {
  if (!LIST_ID) {
    throw new Error('Mailchimp list ID not configured');
  }

  try {
    const subscriberHash = createHash('md5')
      .update(email.toLowerCase())
      .digest('hex');

    const response = await mailchimp.lists.updateListMember(
      LIST_ID,
      subscriberHash,
      {
        status: 'unsubscribed',
      }
    );

    return {
      success: true,
      data: response,
    };
  } catch (error: unknown) {
    console.error('Mailchimp unsubscription error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to unsubscribe from newsletter',
    };
  }
}

// Get subscriber information
export async function getSubscriberInfo(email: string) {
  if (!LIST_ID) {
    throw new Error('Mailchimp list ID not configured');
  }

  try {
    const subscriberHash = createHash('md5')
      .update(email.toLowerCase())
      .digest('hex');

    const response = await mailchimp.lists.getListMember(
      LIST_ID,
      subscriberHash
    );

    return {
      success: true,
      data: response,
    };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
      return {
        success: false,
        error: 'Subscriber not found',
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get subscriber information',
    };
  }
}

// Create a new campaign
export async function createNewsletterCampaign(
  subject: string,
  content: string,
  sendTime?: string
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    // First, create the campaign
    const campaign = await mailchimp.campaigns.create({
      type: 'regular',
      recipients: {
        list_id: LIST_ID || '',
      },
      settings: {
        subject_line: subject,
        from_name: 'Ndigbo Viva',
        reply_to: 'contact@ndigboviva.com',
        title: subject,
      },
    });

    // Set the content
    if (campaign.id) {
      await mailchimp.campaigns.setContent(campaign.id, {
        html: content,
      });

      // Schedule if sendTime is provided
      if (sendTime) {
        await mailchimp.campaigns.schedule(campaign.id, {
          schedule_time: sendTime,
        });
      }
    }

    return {
      success: true,
      data: campaign,
    };
  } catch (error: unknown) {
    console.error('Mailchimp campaign creation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create newsletter campaign',
    };
  }
}

// Send campaign immediately
export async function sendNewsletterCampaign(campaignId: string) {
  try {
    const response = await mailchimp.campaigns.send(campaignId);
    return {
      success: true,
      data: response,
    };
  } catch (error: unknown) {
    console.error('Mailchimp campaign send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send newsletter campaign',
    };
  }
}

// Get campaign statistics
export async function getCampaignStats(campaignId: string) {
  try {
    const response = await mailchimp.campaigns.get(campaignId);
    return {
      success: true,
      data: {
        id: response.id,
        status: response.status,
        subject: response.settings.subject_line,
        sendTime: response.send_time,
        recipients: response.recipients,
        reportSummary: response.report_summary,
      },
    };
  } catch (error: unknown) {
    console.error('Mailchimp campaign stats error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get campaign statistics',
    };
  }
}

// Get list statistics
export async function getListStats() {
  if (!LIST_ID) {
    throw new Error('Mailchimp list ID not configured');
  }

  try {
    const response = await mailchimp.lists.getList(LIST_ID);
    return {
      success: true,
      data: {
        id: response.id,
        name: response.name,
        memberCount: response.stats.member_count,
        unsubscribeCount: response.stats.unsubscribe_count,
        cleanedCount: response.stats.cleaned_count,
        memberCountSinceSend: response.stats.member_count_since_send,
        unsubscribeCountSinceSend: response.stats.unsubscribe_count_since_send,
        cleanedCountSinceSend: response.stats.cleaned_count_since_send,
        campaignCount: response.stats.campaign_count,
        campaignLastSent: response.stats.campaign_last_sent,
        mergeFieldCount: response.stats.merge_field_count,
        avgSubRate: response.stats.avg_sub_rate,
        avgUnsubRate: response.stats.avg_unsub_rate,
        targetSubRate: response.stats.target_sub_rate,
        openRate: response.stats.open_rate,
        clickRate: response.stats.click_rate,
      },
    };
  } catch (error: unknown) {
    console.error('Mailchimp list stats error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get list statistics',
    };
  }
}

// Add tags to subscriber
export async function addTagsToSubscriber(email: string, tags: string[]) {
  if (!LIST_ID) {
    throw new Error('Mailchimp list ID not configured');
  }

  try {
    const subscriberHash = createHash('md5')
      .update(email.toLowerCase())
      .digest('hex');

    const response = await mailchimp.lists.updateListMemberTags(
      LIST_ID,
      subscriberHash,
      {
        tags: tags.map(tag => ({ name: tag, status: 'active' })),
      }
    );

    return {
      success: true,
      data: response,
    };
  } catch (error: unknown) {
    console.error('Mailchimp add tags error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add tags to subscriber',
    };
  }
}
