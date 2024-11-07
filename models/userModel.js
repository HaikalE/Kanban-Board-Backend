const pool = require('../config/db');

const findUserByEmail = async (email) => {
    const res = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
    return res.rows[0];
};

const createUser = async (name, email, passwordHash) => {
    const res = await pool.query(
        'INSERT INTO Users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
        [name, email, passwordHash]
    );
    return res.rows[0];
};

// Fungsi untuk mendapatkan collaborator berdasarkan board_id dan user_id
const getCollaboratorByBoardAndUser = async (boardId, userId) => {
    try {
        const res = await pool.query(
            'SELECT * FROM Collaborators WHERE board_id = $1 AND user_id = $2',
            [boardId, userId]
        );

        // Jika data tidak ditemukan, return null
        if (res.rows.length === 0) {
            return null;
        }

        // Kembalikan data pertama (karena seharusnya hanya ada satu pasangan boardId dan userId)
        return res.rows[0];
    } catch (err) {
        console.error(`Error getting collaborator: ${err.message}`);
        throw err; // Buang error agar bisa di-handle di tempat lain
    }
};

module.exports = { findUserByEmail, createUser, getCollaboratorByBoardAndUser };
