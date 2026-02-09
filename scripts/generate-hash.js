// Generate bcrypt hash for admin password
const bcrypt = require('bcryptjs');

const password = 'admin123';
const hash = bcrypt.hashSync(password, 10);

console.log('\n╔════════════════════════════════════════════╗');
console.log('║     ADMIN PASSWORD HASH GENERATOR         ║');
console.log('╚════════════════════════════════════════════╝\n');
console.log('Password:', password);
console.log('Hash:', hash);
console.log('\nUpdate this hash in database/schema.sql');
console.log('Replace: $2a$10$YourHashedPasswordHere');
console.log('With:', hash);
console.log('\n');
