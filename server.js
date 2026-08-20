 const app = require('./src/app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🍽️  Urban Palate Server Running`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📁 Public folder: ${__dirname}/public`);
  console.log(`📱 WhatsApp Provider: ${process.env.WHATSAPP_PROVIDER || 'callmebot'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});