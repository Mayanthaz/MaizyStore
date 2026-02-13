const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const formatMessage = (level, message) => {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${level.toUpperCase()}: ${message}\n`;
};

const logger = {
    info: (message) => {
        const msg = formatMessage('info', message);
        console.log(msg.trim());
        fs.appendFileSync(path.join(logDir, 'combined.log'), msg);
    },
    error: (message, error) => {
        const errorDetails = error ? ` - ${error.stack || error}` : '';
        const msg = formatMessage('error', `${message}${errorDetails}`);
        console.error(msg.trim());
        fs.appendFileSync(path.join(logDir, 'error.log'), msg);
        fs.appendFileSync(path.join(logDir, 'combined.log'), msg);
    },
    warn: (message) => {
        const msg = formatMessage('warn', message);
        console.warn(msg.trim());
        fs.appendFileSync(path.join(logDir, 'combined.log'), msg);
    }
};

module.exports = logger;
