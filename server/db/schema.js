const db = require('./db');

const createTables = async () => {
    //Users table
    try{
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(20),
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
                `);
    //Friendships table
    await db.query(`
        CREATE TABLE IF NOT EXISTS friendships(
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        friend_id INTEGER NOT NULL REFERENCES users(id),
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_friendship UNIQUE(user_id, friend_id)
        )
        `);
    //Games table
    await db.query(`
        CREATE TABLE IF NOT EXISTS games(
        id SERIAL PRIMARY KEY,
        creator_id INTEGER NOT NULL REFERENCES users(id),
        title VARCHAR(100) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        max_players INTEGER DEFAULT 5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `);
    //Game Participants table
    await db.query(`
        CREATE TABLE IF NOT EXISTS game_participants (
        id SERIAL PRIMARY KEY,
        game_id INTEGER NOT NULL REFERENCES games(id),
        user_id INTEGER NOT NULL REFERENCES users(id),
        score INTEGER DEFAULT 0,
        turn_order INTEGER NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'invited',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_participant UNIQUE(game_id, user_id)
        )
        `);
    //Rounds table
    await db.query(`
        CREATE TABLE IF NOT EXISTS rounds (
        id SERIAL PRIMARY KEY,
        game_id INTEGER NOT NULL REFERENCES games(id),
        leader_id INTEGER NOT NULL REFERENCES users(id),
        round_number INTEGER NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'waiting',
        time_limit INTEGER,
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `);
    //Required words table
    await db.query(`
        CREATE TABLE IF NOT EXISTS required_words (
        id SERIAL PRIMARY KEY,
        round_id INTEGER NOT NULL REFERENCES rounds(id),
        word VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `);
    //Poems table
    await db.query(`
        CREATE TABLE IF NOT EXISTS poems (
        id SERIAL PRIMARY KEY,
        round_id INTEGER NOT NULL REFERENCES rounds(id),
        author_id INTEGER NOT NULL REFERENCES users(id),
        content TEXT,
        submission_time TIMESTAMP,
        is_winner BOOLEAN DEFAULT false,
        is_late BOOLEAN DEFAULT false,
        all_words_used BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `);
    //Word usage table
    await db.query(`
        CREATE TABLE IF NOT EXISTS word_usages (
        id SERIAL PRIMARY KEY,
        poem_id INTEGER NOT NULL REFERENCES poems(id),
        word_id INTEGER NOT NULL REFERENCES required_words(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_word_usage UNIQUE(poem_id, word_id)
        )
        `);
    //Notifications table
    await db.query(`
        CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        type VARCHAR(50) NOT NULL,
        content TEXT,
        is_read BOOLEAN DEFAULT false,
        related_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `);

    console.log('All tables created successfully');

    } catch(error) {
        console.error('Error creating tables:', error);
        throw error;
    }
};

module.exports = {
    createTables
};