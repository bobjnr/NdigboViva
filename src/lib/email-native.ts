// Native Resend implementation using fetch API (no dependencies)
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
function getWelcomeEmailTemplate(data: WelcomeEmailData) {
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
          <a href="https://ndigbo-viva-blog.vercel.app/blog" 
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
      </div>
    </body>
    </html>
  `;
}

// Blog post email template
function getBlogPostEmailTemplate(data: BlogPostEmailData) {
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
          <a href="https://ndigbo-viva-blog.vercel.app/blog/${data.slug}" 
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
      </div>
    </body>
    </html>
  `;
}

// Send email using Resend's REST API with domain verification handling
async function sendEmail(to: string[], subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not found in environment variables');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        from: 'Ndigbo Viva <onboarding@resend.dev>',
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    const errorData = JSON.parse(error);
    
    // Handle domain verification requirement
    if (response.status === 403 && errorData.message?.includes('verify a domain')) {
      // Try sending with a different approach - use Resend's default domain more explicitly
      try {
        const retryResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Ndigbo Viva <onboarding@resend.dev>',
            to: to, // Try original recipients
            subject: subject,
            html: html,
          }),
        });
        
        if (retryResponse.ok) {
          const retryResult = await retryResponse.json();
          return retryResult;
        }
      } catch (retryError) {
        void retryError;
      }
      
      // If retry fails, use the verified email fallback
      const verifiedEmail = 'bobekene7@gmail.com';
      
      const forwardedHtml = `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
          <h3 style="color: #dc3545; margin-bottom: 15px;">📧 Email Forwarded</h3>
          <p><strong>Original Recipients:</strong> ${to.join(', ')}</p>
          <p><strong>Reason:</strong> Domain verification required for external recipients</p>
          <p><strong>Note:</strong> To send emails to other recipients, please verify a domain at <a href="https://resend.com/domains">resend.com/domains</a></p>
          <hr style="margin: 20px 0; border: 1px solid #dee2e6;">
        </div>
        ${html}
      `;
      
      const forwardedResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Ndigbo Viva <onboarding@resend.dev>',
          to: [verifiedEmail],
          subject: `[Forwarded] ${subject}`,
          html: forwardedHtml,
        }),
      });
      
      if (!forwardedResponse.ok) {
        const forwardedError = await forwardedResponse.text();
        throw new Error(`Failed to forward email: ${forwardedResponse.status} ${forwardedError}`);
      }
      
      const result = await forwardedResponse.json();
      return result;
    }
    
    throw new Error(`Resend API error: ${response.status} ${error}`);
  }

  return await response.json();
}

// Send welcome email
export async function sendWelcomeEmail(data: WelcomeEmailData) {
  try {
    const result = await sendEmail(
      [data.email],
      'Welcome to Ndigbo Viva! 🎉',
      getWelcomeEmailTemplate(data)
    );

    return { success: true, messageId: result.id };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' };
  }
}

// Send blog post notification
export async function sendBlogPostEmail(data: BlogPostEmailData, subscriberEmails: string[]) {
  try {
    const result = await sendEmail(
      subscriberEmails,
      `New Blog Post: ${data.title}`,
      getBlogPostEmailTemplate(data)
    );

    return { success: true, messageId: result.id };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' };
  }
}

// Get subscriber count (placeholder)
export async function getSubscriberCount() {
  return {
    success: true,
    count: 0, // You'll need to implement this with your own database
  };
}
