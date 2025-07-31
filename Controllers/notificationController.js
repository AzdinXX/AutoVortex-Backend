const db = require('../db');

exports.getAllNotifications = (req, res) => {
  console.log('Fetching all notifications (rentals + offer requests)...');
  
  // Get car rentals
  const rentalsSql = `
    SELECT 
      rentals.id,
      rentals.user_id,
      rentals.car_id,
      rentals.start_date,
      rentals.end_date,
      rentals.status,
      rentals.message,
      rentals.admin_reply,
      rentals.admin_reply_date,
      rentals.created_at,
      users.username AS user_name,
      users.phone AS user_phone,
      users.image AS user_image,
      cars.brand AS car_name,
      'rental' AS request_type
    FROM rentals
    JOIN users ON rentals.user_id = users.id
    JOIN cars ON rentals.car_id = cars.id
  `;
  
  // Get offer requests
  const offerRequestsSql = `
    SELECT 
      or.id,
      or.user_id,
      or.offer_id AS car_id,
      or.start_date,
      or.end_date,
      or.status,
      or.message,
      or.admin_reply,
      or.admin_reply_date,
      or.created_at,
      COALESCE(u.username, 'Unknown User') AS user_name,
      COALESCE(u.phone, 'No phone') AS user_phone,
      u.image AS user_image,
      COALESCE(o.title, 'Unknown Offer') AS car_name,
      'offer_request' AS request_type
    FROM offer_requests or
    LEFT JOIN users u ON or.user_id = u.id
    LEFT JOIN offers o ON or.offer_id = o.id
  `;
  
  // Get rentals first
  db.query(rentalsSql, (err, rentalResults) => {
    if (err) {
      console.error('Error fetching rentals:', err);
      rentalResults = [];
    }
    
    console.log(`Rentals query result: ${rentalResults.length} rentals found`);
    
    // Then get offer requests
    db.query(offerRequestsSql, (err2, offerResults) => {
      if (err2) {
        console.error('Error fetching offer requests:', err2);
        console.error('SQL Error details:', err2.message);
        offerResults = [];
      }
      
      console.log(`Offer requests query result: ${offerResults.length} offer requests found`);
      
      // Combine both results
      const allResults = [...rentalResults, ...offerResults];
      
      // Sort by created_at descending
      allResults.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      console.log(`Total results: ${allResults.length} (${rentalResults.length} rentals + ${offerResults.length} offer requests)`);
      res.json(allResults);
    });
  });
};


exports.deleteNotification = (req, res) => {
  const { id, type } = req.params;
  
  let tableName = 'rentals';
  
  if (type === 'offer') {
    tableName = 'offer_requests';
  }
  
  const sql = `DELETE FROM ${tableName} WHERE id = ?`;
  
  db.query(sql, [id], err => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Delete failed' });
    }
    res.status(200).json({ message: 'Deleted' });
  });
};




exports.acceptNotification = (req, res) => {
  const { id, type } = req.params;
  
  let tableName = 'rentals';
  let statusValue = 'confirmed';
  
  if (type === 'offer') {
    tableName = 'offer_requests';
    statusValue = 'approved';
  }
  
  const sql = `UPDATE ${tableName} SET status=? WHERE id=?`;
  
  db.query(sql, [statusValue, id], (err) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Update failed' });
    }
    res.status(200).json({ message: type === 'offer' ? 'Offer request accepted' : 'Rental accepted' });
  });
};

exports.rejectNotification = (req, res) => {
  const { id, type } = req.params;
  
  let tableName = 'rentals';
  let statusValue = 'cancelled';
  
  if (type === 'offer') {
    tableName = 'offer_requests';
    statusValue = 'rejected';
  }
  
  const sql = `UPDATE ${tableName} SET status=? WHERE id=?`;
  
  db.query(sql, [statusValue, id], (err) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Update failed' });
    }
    res.status(200).json({ message: type === 'offer' ? 'Offer request rejected' : 'Rental rejected' });
  });
};

exports.getUserNotifications = (req, res) => {
  const userId = req.params.id;
  
  // Get user's rentals
  const rentalsSql = `
    SELECT 
      id,
      user_id,
      car_id,
      start_date,
      end_date,
      status,
      message,
      admin_reply,
      admin_reply_date,
      created_at,
      'rental' AS request_type
    FROM rentals 
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;
  
  // Get user's offer requests
  const offerRequestsSql = `
    SELECT 
      id,
      user_id,
      offer_id AS car_id,
      start_date,
      end_date,
      status,
      message,
      admin_reply,
      admin_reply_date,
      created_at,
      'offer_request' AS request_type
    FROM offer_requests 
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;
  
  // Get rentals first
  db.query(rentalsSql, [userId], (err, rentalResults) => {
    if (err) {
      console.error('Error fetching user rentals:', err);
      rentalResults = [];
    }
    
    // Then get offer requests
    db.query(offerRequestsSql, [userId], (err2, offerResults) => {
      if (err2) {
        console.error('Error fetching user offer requests:', err2);
        offerResults = [];
      }
      
      // Combine both results
      const allResults = [...rentalResults, ...offerResults];
      
      // Sort by created_at descending
      allResults.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      console.log(`Found ${rentalResults.length} rentals and ${offerResults.length} offer requests for user ${userId}`);
      res.json(allResults);
    });
  });
};

exports.addAdminReply = (req, res) => {
  const { id, type } = req.params;
  const { admin_reply } = req.body;
  
  if (!admin_reply || admin_reply.trim() === '') {
    return res.status(400).json({ error: 'Reply message is required' });
  }
  
  let tableName = 'rentals';
  
  if (type === 'offer') {
    tableName = 'offer_requests';
  }
  
  const sql = `UPDATE ${tableName} SET admin_reply = ?, admin_reply_date = CURRENT_TIMESTAMP WHERE id = ?`;
  
  db.query(sql, [admin_reply.trim(), id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to add reply' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    res.status(200).json({ message: 'Reply added successfully' });
  });
};