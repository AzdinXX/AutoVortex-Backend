
const bcrypt = require('bcrypt');
const db = require('./db');

async function createAdminUser() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = {
      username: 'admin',
      email: 'admin@autovortex.com',
      password: hashedPassword,
      role: 'admin',
      phone: '1234567890'
    };

    const sql = 'INSERT INTO users (username, email, password, role, phone) VALUES (?, ?, ?, ?, ?)';
    
    db.query(sql, [adminUser.username, adminUser.email, adminUser.password, adminUser.role, adminUser.phone], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log('Admin user already exists');
        } else {
          console.error('Error creating admin user:', err);
        }
      } else {
        console.log('Admin user created successfully!');
        console.log('Email: admin@autovortex.com');
        console.log('Password: admin123');
      }
      process.exit(0);
    });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAdminUser();