
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OTPRequest {
  username: string;
}

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username }: OTPRequest = await req.json();
    
    // Generate random 6-digit OTP
    const otp = generateOTP();
    
    console.log(`Generated OTP ${otp} for user ${username}`);

    const emailResponse = await resend.emails.send({
      from: "Login System <onboarding@resend.dev>",
      to: ["urbantechub@gmail.com"],
      subject: "Login OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Login OTP</h1>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; color: #333;">Hello,</p>
            <p style="font-size: 16px; color: #333;">A login attempt was made for username: <strong>${username}</strong></p>
            <p style="font-size: 16px; color: #333;">Your 6-digit OTP is:</p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #0066cc; background-color: #e6f2ff; padding: 15px 25px; border-radius: 8px; letter-spacing: 3px;">${otp}</span>
            </div>
            <p style="font-size: 14px; color: #666; margin-top: 20px;">This OTP is valid for a limited time. Please use it to complete your login.</p>
          </div>
        </div>
      `,
    });

    console.log("OTP email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      otp: otp, // Return OTP for verification
      message: "OTP sent successfully" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
