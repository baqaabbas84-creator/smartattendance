const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendLowAttendanceEmail = async (studentEmail, studentName, subjectName, attendancePct) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Skipping email notification: EMAIL_USER or EMAIL_PASS not configured in .env');
    return;
  }

  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Smart Attendance System" <${process.env.EMAIL_USER}>`,
      to: studentEmail,
      subject: `⚠️ Low Attendance Warning: ${subjectName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #ef4444; text-align: center;">Low Attendance Warning</h2>
          <p>Dear <strong>${studentName}</strong>,</p>
          <p>This is an automated notification from the Smart Attendance System to inform you that your attendance in <strong>${subjectName}</strong> has fallen below the minimum required threshold.</p>
          
          <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-size: 16px;">Current Attendance: <strong style="color: #ef4444;">${attendancePct}%</strong></p>
          </div>
          
          <p>Please ensure you attend the upcoming classes regularly to meet the required criteria and avoid any academic penalties.</p>
          
          <p style="margin-top: 30px; font-size: 12px; color: #64748b; text-align: center;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Low attendance warning email sent to ${studentEmail}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};

module.exports = {
  sendLowAttendanceEmail,
};
