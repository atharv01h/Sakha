import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import * as SibApiV3Sdk from 'npm:sib-api-v3-typescript';

const BREVO_API_KEY = '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';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, verificationUrl } = await req.json();

    // Initialize Brevo API client
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, BREVO_API_KEY);

    // Create email template
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    sendSmtpEmail.subject = '🙏 Verify your email for Sakha Chatbot';
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #6366f1; text-align: center;">Welcome to Sakha Chatbot! 🙏</h1>
        
        <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="font-size: 16px; line-height: 1.5; color: #374151;">
            Namaste! We're delighted to have you join our spiritual journey. To begin your path to enlightenment, please verify your email address.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #6366f1; color: white; padding: 12px 24px; 
                      border-radius: 6px; text-decoration: none; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
            If the button doesn't work, you can copy and paste this link into your browser:
            <br>
            <span style="color: #6366f1;">${verificationUrl}</span>
          </p>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 20px;">
          🕉️ Om Shanti, Shanti, Shanti 🕉️
        </p>
      </div>
    `;

    sendSmtpEmail.sender = {
      name: 'Sakha Chatbot',
      email: 'noreply@sakhachatbot.com'
    };
    
    sendSmtpEmail.to = [{
      email: email,
      name: 'Valued Seeker'
    }];

    // Send the email
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

    return new Response(
      JSON.stringify({ 
        message: 'Verification email sent successfully',
        details: result
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error sending verification email:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send verification email',
        details: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});