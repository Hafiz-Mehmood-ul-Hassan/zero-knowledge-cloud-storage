from datetime import datetime
import resend


# print(template)

def send_mail(otp,email):
    resend.api_key="re_Lyh1C2sG_3N7YLqc4s11yydBrN7ey47Hd"
    
    r = resend.Emails.send({
    "from": "onboarding@resend.dev",
    "to": "usmansabir117@gmail.com",
    "subject": "voultx OTP",
    "html": f"""

    <div class="container">
      <h1>Your Voultx Verification Code</h1>
      <p>Use the code below to verify your account. It will expire in 10 minutes:</p>
      <div class="otp">{otp}</div>
      <div class="email"><strong>Email:</strong> {email}</div>
      <p>If you did not request this code, please ignore this email.</p>
      <div class="footer">© 2025 Voultx. All rights reserved.</div>
    </div>
    """
  })
