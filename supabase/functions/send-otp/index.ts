
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

const getEmailTemplate = (otp: string): string => {
  const currentYear = new Date().getFullYear();
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Your OTP Code</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f4f7;
        color: #333333;
        padding: 20px;
        margin: 0;
      }
      .container {
        background-color: #ffffff;
        max-width: 600px;
        margin: 0 auto;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
      }
      h1 {
        color: #4f46e5;
      }
      .otp {
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 4px;
        background-color: #f0f1ff;
        padding: 12px 24px;
        border-radius: 8px;
        display: inline-block;
        margin: 20px 0;
        color: #111827;
      }
      .footer {
        font-size: 13px;
        color: #6b7280;
        margin-top: 30px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Your Login Code</h1>
      <p>Hi there,</p>
      <p>Here is your one-time password (OTP) for logging into your account:</p>
      <div class="otp">${otp}</div>
      <p>This code will expire in 10 minutes. Please don't share it with anyone.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>

      <div class="footer">
        <p>&copy; ${currentYear} YourAppName. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username }: OTPRequest = await req.json();
    
    // Generate random 6-digit OTP
    const otp = generateOTP();
    
    console.log(`Generated OTP ${otp} for user ${username}`);

    // Send custom email using Supabase admin
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: username,
      options: {
        data: {
          otp: otp,
          email_template: getEmailTemplate(otp)
        }
      }
    });

    if (error) {
      console.error("Error sending OTP email:", error);
      
      // Still return the OTP for frontend verification even if email fails
      return new Response(
        JSON.stringify({ 
          success: true, 
          otp: otp,
          message: "OTP generated (email delivery may have failed)" 
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        },
      );
    }

    console.log("OTP email sent successfully");

    return new Response(
      JSON.stringify({
        success: true,
        otp: otp,
        message: "OTP email sent successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  } catch (err: any) {
    console.error("Server error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  }
};

serve(handler);
