const db = require('./db');
const { createTables } = require('./schema');

// Sample data for seeding
const seedData = async () => {
  try {
    // First, ensure tables exist
    await createTables();
    
    // Add sample users
    const user1 = await db.query(
      `INSERT INTO users (username, email, phone, password) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id`,
      ['johnsmith', 'john@example.com', '555-123-4567', 'password123']
    );
    
    const user2 = await db.query(
      `INSERT INTO users (username, email, phone, password) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id`,
      ['janedoe', 'jane@example.com', '555-987-6543', 'password456']
    );
    
    console.log('Users added successfully');
    
    // Add a friendship
    await db.query(
      `INSERT INTO friendships (user_id, friend_id, status) 
       VALUES ($1, $2, $3)`,
      [user1.rows[0].id, user2.rows[0].id, 'accepted']
    );
    
    console.log('Friendship added successfully');
    
    // Create a game
    const game = await db.query(
      `INSERT INTO games (creator_id, title, status) 
       VALUES ($1, $2, $3) 
       RETURNING id`,
      [user1.rows[0].id, 'First Poetry Game', 'active']
    );
    
    console.log('Game added successfully');
    
    // Add game participants
    await db.query(
      `INSERT INTO game_participants (game_id, user_id, turn_order, status) 
       VALUES ($1, $2, $3, $4)`,
      [game.rows[0].id, user1.rows[0].id, 1, 'accepted']
    );
    
    await db.query(
      `INSERT INTO game_participants (game_id, user_id, turn_order, status) 
       VALUES ($1, $2, $3, $4)`,
      [game.rows[0].id, user2.rows[0].id, 2, 'accepted']
    );
    
    console.log('Game participants added successfully');
    
    // Create a round
    const round = await db.query(
      `INSERT INTO rounds (game_id, leader_id, round_number, status) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id`,
      [game.rows[0].id, user1.rows[0].id, 1, 'active']
    );
    
    console.log('Round added successfully');
    
    // Add required words
    const word1 = await db.query(
      `INSERT INTO required_words (round_id, word) 
       VALUES ($1, $2) 
       RETURNING id`,
      [round.rows[0].id, 'ocean']
    );
    
    const word2 = await db.query(
      `INSERT INTO required_words (round_id, word) 
       VALUES ($1, $2) 
       RETURNING id`,
      [round.rows[0].id, 'mountain']
    );
    
    const word3 = await db.query(
      `INSERT INTO required_words (round_id, word) 
       VALUES ($1, $2) 
       RETURNING id`,
      [round.rows[0].id, 'star']
    );
    
    const word4 = await db.query(
      `INSERT INTO required_words (round_id, word) 
       VALUES ($1, $2) 
       RETURNING id`,
      [round.rows[0].id, 'whisper']
    );
    
    const word5 = await db.query(
      `INSERT INTO required_words (round_id, word) 
       VALUES ($1, $2) 
       RETURNING id`,
      [round.rows[0].id, 'dream']
    );
    
    console.log('Required words added successfully');
    
    // Add a poem
    const poem = await db.query(
      `INSERT INTO poems (round_id, author_id, content, submission_time, all_words_used) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id`,
      [
        round.rows[0].id, 
        user1.rows[0].id, 
        'Mountains rise above the ocean,\nStars reflect in waters deep.\nWhispers carry on the breeze,\nAs I dream of peaceful sleep.',
        new Date(),
        true
      ]
    );
    
    console.log('Poem added successfully');
    
    // Track word usage
    await db.query(
      `INSERT INTO word_usages (poem_id, word_id) VALUES ($1, $2)`,
      [poem.rows[0].id, word1.rows[0].id]
    );
    
    await db.query(
      `INSERT INTO word_usages (poem_id, word_id) VALUES ($1, $2)`,
      [poem.rows[0].id, word2.rows[0].id]
    );
    
    await db.query(
      `INSERT INTO word_usages (poem_id, word_id) VALUES ($1, $2)`,
      [poem.rows[0].id, word3.rows[0].id]
    );
    
    await db.query(
      `INSERT INTO word_usages (poem_id, word_id) VALUES ($1, $2)`,
      [poem.rows[0].id, word4.rows[0].id]
    );
    
    await db.query(
      `INSERT INTO word_usages (poem_id, word_id) VALUES ($1, $2)`,
      [poem.rows[0].id, word5.rows[0].id]
    );
    
    console.log('Word usages tracked successfully');
    
    // Add notification
    await db.query(
      `INSERT INTO notifications (user_id, type, content, related_id) 
       VALUES ($1, $2, $3, $4)`,
      [
        user2.rows[0].id, 
        'your_turn', 
        'It\'s your turn to submit a poem!',
        round.rows[0].id
      ]
    );
    
    console.log('Notification added successfully');
    console.log('Database seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Verify db
const verifyDatabase = async () => {
  try {
    console.log('\n--- Database Verification ---');
    
// Check tables
    const tables = [
      'users', 'friendships', 'games', 'game_participants', 
      'rounds', 'required_words', 'poems', 'word_usages', 'notifications'
    ];
    
    for (const table of tables) {
      const result = await db.query(`SELECT COUNT(*) FROM ${table}`);
      console.log(`${table}: ${result.rows[0].count} records`);
    }
    
// Verify relationships
    const poemWithWords = await db.query(`
      SELECT p.id, p.content, u.username as author, array_agg(rw.word) as words
      FROM poems p
      JOIN users u ON p.author_id = u.id
      JOIN word_usages wu ON wu.poem_id = p.id
      JOIN required_words rw ON wu.word_id = rw.id
      GROUP BY p.id, u.username
    `);
    
    console.log('\n--- Sample Poem with Words ---');
    console.log(poemWithWords.rows[0]);
    
    console.log('\nDatabase verification complete!');
    
  } catch (error) {
    console.error('Error verifying database:', error);
  }
};

// Run both functions
const initializeAndVerify = async () => {
  await seedData();
  await verifyDatabase();
  process.exit(0);
};

initializeAndVerify();
