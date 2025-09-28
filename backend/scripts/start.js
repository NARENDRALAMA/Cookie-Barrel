const { seedDatabase } = require('../seedData');
const config = require('../config');

// Seed the database and start the server
const startServer = async () => {
  try {
    console.log('🌱 Seeding database...');
    await seedDatabase();
    console.log('✅ Database seeded successfully');
    
    console.log('🚀 Starting server...');
    require('../server');
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

startServer();

