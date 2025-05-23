const pool = require('./config/db');

async function testConnection() {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        console.log('✅ DB Connected: Result =', rows[0].result); // Should log: 2
    } catch (err) {
        console.error('❌ DB Connection Error:', err.message);
    }
}

testConnection();
