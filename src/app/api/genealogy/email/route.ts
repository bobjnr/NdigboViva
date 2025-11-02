import { NextRequest, NextResponse } from 'next/server';
import { subscribeToNewsletter, addTagsToSubscriber } from '@/lib/mailchimp';
import { type GenealogyFormSubmission } from '@/lib/genealogy-database';

export async function POST(request: NextRequest) {
  try {
    const formData: GenealogyFormSubmission = await request.json();

    // Subscribe user to newsletter with genealogy tag
    const subscriptionResult = await subscribeToNewsletter({
      email: formData.email,
      firstName: formData.personalName,
      lastName: formData.familyName,
      tags: ['genealogy', 'igbo-heritage']
    });

    if (!subscriptionResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: subscriptionResult.error || 'Failed to subscribe to newsletter' 
        },
        { status: 400 }
      );
    }

    // Add additional tags for genealogy tracking
    await addTagsToSubscriber(formData.email, [
      'genealogy-submitted',
      `origin-state-${formData.originState.toLowerCase().replace(/\s+/g, '-')}`,
      `current-continent-${formData.currentContinent.toLowerCase().replace(/\s+/g, '-')}`
    ]);

    // Generate personalized email content
    const emailContent = generateGenealogyEmailContent(formData);

    // TODO: Send personalized email using Mailchimp campaigns or transactional email
    // For now, we'll just log the content
    console.log('Genealogy email content:', emailContent);

    return NextResponse.json({
      success: true,
      message: 'Genealogy information submitted successfully. A personalized email will be sent to you shortly.',
      emailContent: emailContent
    });

  } catch (error) {
    console.error('Genealogy email error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process genealogy submission' 
      },
      { status: 500 }
    );
  }
}

function generateGenealogyEmailContent(formData: GenealogyFormSubmission): string {
  const currentLocation = formData.currentCountry === 'Nigeria' 
    ? `${formData.currentTown}, ${formData.currentState}, Nigeria`
    : `${formData.currentTown || formData.currentState}, ${formData.currentCountry}`;

  const originLocation = `${formData.originTown}, ${formData.originState}`;
  const townQuarter = formData.originTownQuarter ? ` (${formData.originTownQuarter})` : '';
  const obiAreas = formData.originObiAreas ? ` - Obi Areas: ${formData.originObiAreas}` : '';
  const clan = formData.originClan ? ` - Clan: ${formData.originClan}` : '';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #D4AF37, #228B22); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px;">Ndigbo Viva</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Tracing Your Igbo Heritage</p>
      </div>
      
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #D4AF37; margin-top: 0;">Thank You, ${formData.personalName}!</h2>
        
        <p>Dear ${formData.personalName} ${formData.familyName},</p>
        
        <p>Thank you for submitting your genealogy information to the Ndigbo Viva project. We're excited to help you trace your Igbo roots and connect with your heritage.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #228B22; margin-top: 0;">Your Submission Summary</h3>
          
          <p><strong>Current Location:</strong> ${currentLocation}</p>
          <p><strong>Origin Location:</strong> ${originLocation}${townQuarter}${obiAreas}${clan}</p>
          <p><strong>Kindred/Hamlet:</strong> ${formData.kindred}</p>
          ${formData.umunna ? `<p><strong>Umunna (Extended Family):</strong> ${formData.umunna}</p>` : ''}
          <p><strong>Email:</strong> ${formData.email}</p>
          ${formData.phone ? `<p><strong>Phone:</strong> ${formData.phone}</p>` : ''}
          
          ${formData.additionalInfo ? `
            <h4>Additional Information:</h4>
            <p style="font-style: italic;">${formData.additionalInfo}</p>
          ` : ''}
        </div>
        
        <h3 style="color: #D4AF37;">What Happens Next?</h3>
        <ul style="line-height: 1.6;">
          <li>Our genealogy team will research your lineage using our comprehensive database</li>
          <li>We'll look for connections to your ancestral villages and extended family</li>
          <li>You'll receive a detailed family tree and ancestral information within 2-3 weeks</li>
          <li>We'll connect you with relatives and cultural communities worldwide</li>
        </ul>
        
        <div style="background: #D4AF37; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3 style="margin-top: 0;">Stay Connected</h3>
          <p>You've been subscribed to our newsletter to receive updates about:</p>
          <ul style="text-align: left; display: inline-block;">
            <li>Genealogy research progress</li>
            <li>Igbo cultural events and news</li>
            <li>Community connections and reunions</li>
            <li>Heritage preservation initiatives</li>
          </ul>
        </div>
        
        <p>If you have any questions or additional information to share, please don't hesitate to contact us.</p>
        
        <p>With warm regards,<br>
        The Ndigbo Viva Team</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        
        <div style="text-align: center; color: #666; font-size: 12px;">
          <p>Ndigbo Viva - Preserving Igbo Heritage Worldwide</p>
          <p>Visit us at: <a href="https://ndigboviva.com" style="color: #D4AF37;">ndigboviva.com</a></p>
        </div>
      </div>
    </div>
  `;
}
