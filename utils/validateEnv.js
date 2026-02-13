const logger = require('./logger');

const requiredVars = [
    'DB_HOST',
    'DB_USER',
    'DB_NAME',
    'JWT_SECRET',
    'PORT'
];

const validateEnv = () => {
    const missing = requiredVars.filter(v => !process.env[v]);

    if (missing.length > 0) {
        logger.error(`❌ CRITICAL ERROR: Missing required environment variables: ${missing.join(', ')}`);
        logger.error('Please check your .env file or host configuration.');
        process.exit(1);
    }

    logger.info('✅ Environment variables validated');
};

module.exports = validateEnv;
