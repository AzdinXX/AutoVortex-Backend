const db = require('./db');

async function createOffersTable() {
  try {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS offers (
        id INT(11) PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        discount_percentage DECIMAL(5,2) NOT NULL,
        original_price DECIMAL(10,2) NOT NULL,
        discounted_price DECIMAL(10,2) NOT NULL,
        valid_until DATE NOT NULL,
        car_type VARCHAR(50) NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        features LONGTEXT NOT NULL,
        rating DECIMAL(3,2) DEFAULT 0.00,
        review_count INT(11) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    db.query(createTableSQL, (err, result) => {
      if (err) {
        console.error('Error creating offers table:', err);
      } else {
        console.log('Offers table created successfully!');
        
        // Insert some sample data
        const sampleOffers = [
          {
            title: "Weekend Special",
            description: "Get 25% off on all luxury cars for weekend rentals",
            discount_percentage: 25.00,
            original_price: 150.00,
            discounted_price: 112.50,
            valid_until: "2024-12-31",
            car_type: "Luxury",
            image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=300&fit=crop",
            features: JSON.stringify(["Free Insurance", "24/7 Support", "Flexible Pickup"]),
            rating: 4.80,
            review_count: 124
          },
          {
            title: "Student Discount",
            description: "Special rates for students with valid ID",
            discount_percentage: 30.00,
            original_price: 80.00,
            discounted_price: 56.00,
            valid_until: "2024-11-30",
            car_type: "Economy",
            image_url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop",
            features: JSON.stringify(["Student ID Required", "Unlimited Mileage", "Roadside Assistance"]),
            rating: 4.60,
            review_count: 89
          },
          {
            title: "Long Term Rental",
            description: "Save big on rentals longer than 7 days",
            discount_percentage: 40.00,
            original_price: 200.00,
            discounted_price: 120.00,
            valid_until: "2024-12-15",
            car_type: "SUV",
            image_url: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=500&h=300&fit=crop",
            features: JSON.stringify(["7+ Days", "Free Maintenance", "GPS Included"]),
            rating: 4.90,
            review_count: 203
          }
        ];

        const insertSQL = `
          INSERT INTO offers (title, description, discount_percentage, original_price, discounted_price, valid_until, car_type, image_url, features, rating, review_count) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        sampleOffers.forEach(offer => {
          db.query(insertSQL, [
            offer.title,
            offer.description,
            offer.discount_percentage,
            offer.original_price,
            offer.discounted_price,
            offer.valid_until,
            offer.car_type,
            offer.image_url,
            offer.features,
            offer.rating,
            offer.review_count
          ], (err, result) => {
            if (err) {
              console.error('Error inserting sample offer:', err);
            } else {
              console.log(`Sample offer "${offer.title}" inserted successfully!`);
            }
          });
        });
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createOffersTable(); 