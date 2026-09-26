require('dotenv').config();
const { sendLowAttendanceEmail } = require('./src/services/emailService');

const runTest = async () => {
  console.log('Testing Email Configuration...');
  console.log(`Using Email: ${process.env.EMAIL_USER}`);
  
  try {
    // Send email to their own address just to test if SMTP is working
    await sendLowAttendanceEmail(
      process.env.EMAIL_USER, 
      'Test User', 
      'Smart Attendance Configuration Test', 
      65
    );
    console.log('✅ Test email command sent successfully! Check your inbox.');
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
};

runTest();
