import mailchimp from '@mailchimp/mailchimp_marketing';
import { createHash } from 'crypto';

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

export interface BlogPostEmailData {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  thumbnail?: string;
  videoId?: string;
}

// Welcome email template
export function getWelcomeEmailTemplate(data: WelcomeEmailData) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Ndigbo Viva!</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">NDIGBO VIVA</h1>
        <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Know Your Roots • Build Solidarity • Invest at Home</p>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #059669; margin-top: 0;">Welcome to our community, ${data.name}! 🎉</h2>
        
        <p>Thank you for joining Ndigbo Viva! You're now part of a growing community dedicated to celebrating Igbo culture and building solidarity.</p>
        
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #166534; margin-top: 0;">What's next?</h3>
          <ul style="color: #166534; margin: 0; padding-left: 20px;">
            <li>Explore our latest blog posts and insights</li>
            <li>Subscribe to our YouTube channel for video content</li>
            <li>Join our community discussions</li>
            <li>Stay updated with our newsletter</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://ndigboviva.com/blog" 
             style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 5px;">
            Explore Our Content
          </a>
          <a href="https://youtube.com/@ndigboviva" 
             style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 5px;">
            Subscribe on YouTube
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          <strong>Umuigbo Kunienu!</strong><br>
          "Onye aghana nwanne ya" - Never abandon your brother/sister
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #6b7280; font-size: 12px; text-align: center;">
          You're receiving this email because you created an account at Ndigbo Viva.<br>
          <a href="https://ndigboviva.com/profile" style="color: #059669;">Manage your email preferences</a>
        </p>
      </div>
    </body>
    </html>
  `;
}

// Blog post notification email template
export function getBlogPostEmailTemplate(data: BlogPostEmailData) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Blog Post: ${data.title}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">NDIGBO VIVA</h1>
        <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">New Content Available!</p>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #1f2937; margin-top: 0;">${data.title}</h2>
        
        ${data.thumbnail ? `
          <div style="text-align: center; margin: 20px 0;">
            <img src="${data.thumbnail}" alt="${data.title}" style="max-width: 100%; height: auto; border-radius: 8px;">
          </div>
        ` : ''}
        
        <p style="color: #4b5563; font-size: 16px;">${data.excerpt}</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://ndigboviva.com/blog/${data.slug}" 
             style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 5px;">
            Read Full Post
          </a>
          ${data.videoId ? `
            <a href="https://youtube.com/watch?v=${data.videoId}" 
               style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 5px;">
              Watch on YouTube
            </a>
          ` : ''}
        </div>
        
        <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">Stay Connected</h3>
          <p style="color: #4b5563; margin: 0;">
            Don't miss out on our latest content! Make sure to:
          </p>
          <ul style="color: #4b5563; margin: 10px 0 0 0; padding-left: 20px;">
            <li>Subscribe to our YouTube channel</li>
            <li>Follow us on social media</li>
            <li>Share this post with your network</li>
          </ul>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #6b7280; font-size: 12px; text-align: center;">
          You're receiving this email because you subscribed to our blog notifications.<br>
          <a href="https://ndigboviva.com/profile" style="color: #059669;">Manage your email preferences</a> | 
          <a href="https://ndigboviva.com/unsubscribe" style="color: #059669;">Unsubscribe</a>
        </p>
      </div>
    </body>
    </html>
  `;
}

// Send welcome email using Mailchimp (automated email)
export async function sendWelcomeEmail(data: WelcomeEmailData) {
  try {
    if (!LIST_ID) {
      throw new Error('Mailchimp list ID not configured');
    }

    // For welcome emails, we'll use Mailchimp's automated email feature
    // First, add the user to the list with a welcome tag
    const subscriberHash = createHash('md5')
      .update(data.email.toLowerCase())
      .digest('hex');

    try {
      // Add or update the subscriber
      await mailchimp.lists.addListMember(LIST_ID, {
        email_address: data.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: data.name,
          LNAME: '',
        },
        tags: ['welcome-email'],
      });

      // Tag the subscriber for welcome email automation
      await mailchimp.lists.updateListMemberTags(LIST_ID, subscriberHash, {
        tags: [{ name: 'welcome-email', status: 'active' }],
      });

      return { success: true, message: 'User added to list and tagged for welcome email' };
    } catch (listError: unknown) {
      // If user already exists, just tag them
      if (listError && typeof listError === 'object' && 'status' in listError && listError.status === 400 && 'title' in listError && listError.title === 'Member Exists') {
        await mailchimp.lists.updateListMemberTags(LIST_ID, subscriberHash, {
          tags: [{ name: 'welcome-email', status: 'active' }],
        });
        return { success: true, message: 'User tagged for welcome email' };
      }
      throw listError;
    }
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' };
  }
}

// Send blog post notification email using Mailchimp
export async function sendBlogPostEmail(data: BlogPostEmailData) {
  try {
    if (!LIST_ID) {
      throw new Error('Mailchimp list ID not configured');
    }

    // Create a campaign for the blog post notification
    const campaign = await mailchimp.campaigns.create({
      type: 'regular',
      recipients: {
        list_id: LIST_ID,
      },
      settings: {
        subject_line: `New Blog Post: ${data.title}`,
        from_name: 'Ndigbo Viva',
        reply_to: 'blog@ndigboviva.com',
        title: `Blog Post: ${data.title}`,
      },
    });

    // Set the content
    if (campaign.id) {
      await mailchimp.campaigns.setContent(campaign.id, {
        html: getBlogPostEmailTemplate(data),
      });

      // Send to all subscribers
      await mailchimp.campaigns.send(campaign.id);
    }

    return { success: true, campaignId: campaign.id };
  } catch (error) {
    console.error('Error sending blog post email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' };
  }
}

// Get all subscribers from Mailchimp list
export async function getAllSubscribers() {
  try {
    if (!LIST_ID) {
      throw new Error('Mailchimp list ID not configured');
    }

    // Note: getListMembersInfo method not available in current API
    // This is a simplified implementation
    return {
      success: true,
      subscribers: [],
      total: 0,
      message: 'Subscriber list retrieval not available with current API configuration'
    };
  } catch (error) {
    console.error('Error getting subscribers:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get subscribers',
      subscribers: [],
      total: 0,
    };
  }
}
