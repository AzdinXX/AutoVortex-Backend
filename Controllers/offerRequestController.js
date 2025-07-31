const db = require('../db');

exports.createOfferRequest = (req, res) => {
  const { user_id, offer_id, start_date, end_date, message } = req.body;
  
  console.log('Creating offer request:', { user_id, offer_id, start_date, end_date, message });
  
  if (!user_id || !offer_id || !start_date || !end_date) {
    console.log('Missing required fields:', { user_id, offer_id, start_date, end_date });
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO offer_requests (user_id, offer_id, start_date, end_date, status, message, created_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(sql, [user_id, offer_id, start_date, end_date, 'pending', message || ''], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    
    console.log('Offer request created successfully with ID:', result.insertId);
    
    res.status(201).json({ 
      message: 'Offer rent request created successfully!',
      request_id: result.insertId 
    });
  });
};

exports.getAllOfferRequests = (req, res) => {
  const user = req.user;
  
  console.log('Admin requesting offer requests. User:', user);
  
  if (user.role !== 'admin') {
    console.log('Access denied for user:', user);
    return res.status(403).json({ error: 'Access denied' });
  }

  const sql = `
    SELECT or.*, u.name as user_name, u.email as user_email, o.title as offer_title, o.car_type
    FROM offer_requests or
    JOIN users u ON or.user_id = u.id
    JOIN offers o ON or.offer_id = o.id
    ORDER BY or.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    
    console.log('Found offer requests:', results.length);
    res.json(results);
  });
};

exports.updateOfferRequestStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const user = req.user;
  
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const sql = `
    UPDATE offer_requests 
    SET status = ?, updated_at = NOW()
    WHERE id = ?
  `;

  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Offer request not found' });
    }
    
    res.json({ message: 'Offer request status updated successfully' });
  });
};

exports.getUserOfferRequests = (req, res) => {
  const { userId } = req.params;
  const user = req.user;
  
  if (user.id != userId && user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const sql = `
    SELECT or.*, o.title as offer_title, o.car_type, o.discounted_price
    FROM offer_requests or
    JOIN offers o ON or.offer_id = o.id
    WHERE or.user_id = ?
    ORDER BY or.created_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    
    res.json(results);
  });
}; 