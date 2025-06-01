// Resend email integration
export class EmailService {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY!
  }

  async sendOTP(email: string, otp: string) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "ExamGPT <noreply@examgpt.com>",
          to: [email],
          subject: "Your ExamGPT Verification Code",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #000; margin-bottom: 20px;">Verify Your Email</h2>
              <p>Your verification code for ExamGPT is:</p>
              <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                <h1 style="color: #000; font-size: 32px; margin: 0; letter-spacing: 4px;">${otp}</h1>
              </div>
              <p>This code will expire in 10 minutes.</p>
              <p>If you didn't request this code, please ignore this email.</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 12px;">
                This email was sent by ExamGPT. If you have any questions, please contact our support team.
              </p>
            </div>
          `,
        }),
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error sending OTP email:", error)
      throw new Error("Failed to send OTP email")
    }
  }

  async sendWelcomeEmail(email: string, name: string) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "ExamGPT <welcome@examgpt.com>",
          to: [email],
          subject: "Welcome to ExamGPT - Your NEET Journey Begins!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #000; margin-bottom: 20px;">Welcome to ExamGPT, ${name}! 🎉</h2>
              <p>Congratulations on taking the first step towards cracking NEET! We're excited to be part of your journey.</p>
              
              <div style="background: linear-gradient(135deg, #000 0%, #333 100%); color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0;">What's Next?</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>Complete your profile setup</li>
                  <li>Take your first diagnostic test</li>
                  <li>Start practicing with AI-powered MCQs</li>
                  <li>Chat with your AI mentor for guidance</li>
                </ul>
              </div>
              
              <p><strong>Remember:</strong> Every NEET topper was once where you are today. With consistent effort and smart preparation, you can achieve your dreams!</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" 
                   style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Start Your Preparation
                </a>
              </div>
              
              <p>Best of luck with your NEET preparation!</p>
              <p>Team ExamGPT</p>
            </div>
          `,
        }),
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error sending welcome email:", error)
      throw new Error("Failed to send welcome email")
    }
  }
}

export const emailService = new EmailService()
