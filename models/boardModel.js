const pool = require('../config/db');

const getCollaboratorBoardsByUserId = async (userId) => {
    const res = await pool.query(
        `SELECT b.* 
         FROM Boards b
         INNER JOIN Collaborators c ON b.id = c.board_id
         WHERE c.user_id = $1`, 
         [userId]
    );
    return res.rows;
};

// Mengambil semua board milik pengguna
const getBoardsByUserId = async (userId) => {
    const res = await pool.query('SELECT * FROM Boards WHERE owner_id = $1', [userId]);
    return res.rows;
};

const getBoardByBoardId = async (boardId) => {
    const res = await pool.query('SELECT * FROM Boards WHERE id = $1', [boardId]);
    return res.rows;
};

// Menambahkan board baru
const createBoard = async (name, ownerId) => {
    const res = await pool.query(
        'INSERT INTO Boards (name, owner_id) VALUES ($1, $2) RETURNING *',
        [name, ownerId]
    );
    return res.rows[0];
};

module.exports = { getBoardsByUserId, createBoard,getBoardByBoardId, getCollaboratorBoardsByUserId };
