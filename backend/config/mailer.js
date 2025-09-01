import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()



  const hasSmtp = (process.env.SMTP_USER && process.env.SMTP_PASS)
   const cachedTransporter = nodemailer.createTransport({
      service: 'gmail',
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })


cachedTransporter.verify(function(error, success) {
  if (error) {
    console.error('❌ Email transporter verification failed:', error);
  } else {
    console.log('✅ Email transporter is ready to send emails');
    console.log('📧 Email configuration:', {
      user: process.env.SMTP_USER || '',
      service: 'gmail'
    });
  }
});
export const sendOtpEmail = async (toEmail, otpCode) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">LuxuryDrive</h1>
          <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Premium Car Rental Service</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #1a202c; margin: 0 0 20px 0; font-size: 24px; font-weight: 600; text-align: center;">Verify Your Email</h2>
          
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0; text-align: center;">
            Please enter the verification code below to complete your registration.
          </p>
          
          <!-- OTP Code Box -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
            <p style="color: #e2e8f0; margin: 0 0 15px 0; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
            <div style="background: #ffffff; border-radius: 8px; padding: 20px; display: inline-block; min-width: 200px;">
              <p style="font-size: 32px; font-weight: 700; color: #1a202c; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otpCode}</p>
            </div>
          </div>
          
          <div style="background-color: #f7fafc; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <p style="color: #4a5568; font-size: 14px; margin: 0; text-align: center;">
              <strong>⚠️ Important:</strong> This code will expire in 10 minutes for security reasons.
            </p>
          </div>
          
          <p style="color: #718096; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
            If you didn't request this verification code, please ignore this email.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #718096; font-size: 14px; margin: 0 0 10px 0;">© 2024 LuxuryDrive. All rights reserved.</p>
          <p style="color: #a0aec0; font-size: 12px; margin: 0;">This is an automated email, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const info = await cachedTransporter.sendMail({
    from: process.env.SMTP_USER || 'no-reply@luxurydrive.com',
    to: toEmail,
    subject: '🔐 Your Verification Code - LuxuryDrive',
    html,
  })

  const preview = nodemailer.getTestMessageUrl?.(info)
  if (preview) {
    console.log('OTP email preview URL:', preview)
  }
}

export const sendBookingStatusEmail = async ({ toEmail, status, carName, pickupDate, returnDate, price }) => {
  const prettyPickup = new Date(pickupDate).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  const prettyReturn = new Date(returnDate).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  
  const isConfirmed = status === 'confirmed'
  const isCancelled = status === 'cancelled'
  
  const statusConfig = {
    confirmed: {
      title: '🎉 Your Booking is Confirmed!',
      subject: '✅ Booking Confirmed - LuxuryDrive',
      icon: '🎉',
      color: '#10b981',
      bgColor: '#ecfdf5',
      borderColor: '#d1fae5'
    },
    cancelled: {
      title: '❌ Booking Cancelled',
      subject: '❌ Booking Cancelled - LuxuryDrive',
      icon: '❌',
      color: '#ef4444',
      bgColor: '#fef2f2',
      borderColor: '#fecaca'
    },
    pending: {
      title: '⏳ Booking Pending',
      subject: '⏳ Booking Pending - LuxuryDrive',
      icon: '⏳',
      color: '#f59e0b',
      bgColor: '#fffbeb',
      borderColor: '#fed7aa'
    }
  }
  
  const config = statusConfig[status] || statusConfig.pending

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking ${status}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">LuxuryDrive</h1>
          <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Premium Car Rental Service</p>
        </div>
        
        <!-- Status Banner -->
        <div style="background-color: ${config.bgColor}; border: 2px solid ${config.borderColor}; border-radius: 0; padding: 30px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 15px;">${config.icon}</div>
          <h2 style="color: ${config.color}; margin: 0; font-size: 24px; font-weight: 600;">${config.title}</h2>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <!-- Car Details -->
          <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
            <h3 style="color: #1a202c; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">🚗 Vehicle Details</h3>
            <p style="color: #4a5568; font-size: 16px; margin: 0; font-weight: 500;">${carName}</p>
          </div>
          
          <!-- Booking Dates -->
          <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
            <h3 style="color: #1a202c; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">📅 Rental Period</h3>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="text-align: center; flex: 1;">
                <p style="color: #718096; font-size: 12px; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Pickup Date</p>
                <p style="color: #1a202c; font-size: 14px; margin: 0; font-weight: 500;">${prettyPickup}</p>
              </div>
              <div style="font-size: 20px; color: #a0aec0; margin: 0 20px;">→</div>
              <div style="text-align: center; flex: 1;">
                <p style="color: #718096; font-size: 12px; margin: 0 0 5px 0; text-transform: uppercase; font-weight: 600;">Return Date</p>
                <p style="color: #1a202c; font-size: 14px; margin: 0; font-weight: 500;">${prettyReturn}</p>
              </div>
            </div>
          </div>
          
          ${price ? `
          <!-- Price -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 25px; margin-bottom: 30px; text-align: center;">
            <h3 style="color: #ffffff; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">💰 Total Amount</h3>
            <p style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0;">$${price}</p>
          </div>
          ` : ''}
          
          <!-- Status Specific Message -->
          <div style="background-color: ${config.bgColor}; border-radius: 8px; padding: 20px; margin: 30px 0;">
            ${isConfirmed ? `
              <p style="color: #065f46; font-size: 16px; margin: 0; text-align: center; font-weight: 500;">
                🎉 Your booking has been successfully confirmed! We're excited to provide you with an exceptional driving experience.
              </p>
            ` : isCancelled ? `
              <p style="color: #991b1b; font-size: 16px; margin: 0; text-align: center; font-weight: 500;">
                Your booking has been cancelled as requested. If you have any questions, please don't hesitate to contact our support team.
              </p>
            ` : `
              <p style="color: #92400e; font-size: 16px; margin: 0; text-align: center; font-weight: 500;">
                Your booking is currently being processed. We'll notify you once it's confirmed.
              </p>
            `}
          </div>
          
          ${isConfirmed ? `
          <!-- Important Instructions for Confirmed Bookings -->
          <div style="background-color: #fff3cd; border: 2px solid #ffeaa7; border-radius: 12px; padding: 25px; margin: 30px 0;">
            <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; text-align: center;">📋 Important Pickup Instructions</h3>
            <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
              <h4 style="color: #856404; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">🆔 Required Documents (Hard Copies Only)</h4>
              <ul style="color: #856404; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;"><strong>Aadhar Card:</strong> Original or photocopy</li>
                <li style="margin-bottom: 8px;"><strong>Driving License:</strong> Original driving license</li>
                <li style="margin-bottom: 0;"><strong>Additional ID:</strong> Any government-issued photo ID (PAN card, passport, etc.)</li>
              </ul>
            </div>
            <div style="background-color: #ffffff; border-radius: 8px; padding: 20px;">
              <h4 style="color: #856404; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">⚠️ Important Notes</h4>
              <ul style="color: #856404; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Please arrive 15 minutes before your scheduled pickup time</li>
                <li style="margin-bottom: 8px;">All documents must be valid and not expired</li>
                <li style="margin-bottom: 8px;">Digital copies or photos on phone are not accepted</li>
                <li style="margin-bottom: 0;">Vehicle pickup will be denied without proper documentation</li>
              </ul>
            </div>
          </div>
          ` : ''}
          
          <p style="color: #718096; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
            Thank you for choosing LuxuryDrive for your premium car rental needs.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #718096; font-size: 14px; margin: 0 0 10px 0;">© 2024 LuxuryDrive. All rights reserved.</p>
          <p style="color: #a0aec0; font-size: 12px; margin: 0;">This is an automated email, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const info = await cachedTransporter.sendMail({
    from: process.env.SMTP_USER || 'no-reply@luxurydrive.com',
    to: toEmail,
    subject: config.subject,
    html,
  })

  const preview = nodemailer.getTestMessageUrl?.(info)
  if (preview) {
    console.log('Booking email preview URL:', preview)
  }
}

export default cachedTransporter


