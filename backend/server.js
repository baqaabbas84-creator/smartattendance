require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// ─── Start Server ─────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log('\n╔══════════════════════════════════════════════╗');
      console.log('║   🎓 Smart Attendance System — Backend        ║');
      console.log('╠══════════════════════════════════════════════╣');
      console.log(`║  🚀 Server running on port ${PORT}               ║`);
      console.log(`║  📡 API Base URL: http://localhost:${PORT}/api   ║`);
      console.log(`║  🌍 Environment: ${(process.env.NODE_ENV || 'development').padEnd(27)}║`);
      console.log('╚══════════════════════════════════════════════╝\n');
    });

    // ─── Graceful Shutdown ────────────────────────────────────────────────────
    const shutdown = (signal) => {
      console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`);
      server.close(() => {
        console.log('✅ HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // ─── Unhandled Promise Rejections ─────────────────────────────────────────
    process.on('unhandledRejection', (err) => {
      console.error('❌ Unhandled Promise Rejection:', err.message);
      server.close(() => process.exit(1));
    });

  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
