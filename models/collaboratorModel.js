const pool = require('../config/db');

// Mengambil semua collaborator dari board
// const getCollaboratorsByBoardId = async (boardId) => {
//     const res = await pool.query('SELECT * FROM Collaborators WHERE board_id = $1', [boardId]);
//     return res.rows;
// };

const getCollaboratorsByBoardId = async (boardId) => {
    const res = await pool.query(`
        SELECT 
            Collaborators.id AS collaborator_id,
            Collaborators.access_level,
            Users.email,
            Users.name
        FROM Collaborators
        JOIN Users ON Collaborators.user_id = Users.id
        WHERE Collaborators.board_id = $1
    `, [boardId]);
    return res.rows;
};


// Menambahkan collaborator baru
const inviteCollaborator = async (boardId, userId, accessLevel) => {
    const res = await pool.query(
        'INSERT INTO Collaborators (board_id, user_id, access_level) VALUES ($1, $2, $3) RETURNING *',
        [boardId, userId, accessLevel]
    );
    return res.rows[0];
};

const addCollaborator = async (boardId, email, accessLevel) => {
    try {
        // Cari user berdasarkan email
        console.log("AFAAN TU")
        const userRes = await pool.query('SELECT id FROM Users WHERE email = $1', [email]);
        const user = userRes.rows[0];
        if (!user) {
            throw new Error('User not found'); 
        }

        const userId = user.id;

        // Tambahkan kolaborator menggunakan userId yang didapatkan dari email
        const collaboratorRes = await inviteCollaborator(boardId, userId, accessLevel);
        return collaboratorRes;
    } catch (err) {
        console.error(err);
        throw new Error('Failed to invite collaborator');
    }
};

// Mengambil level akses kolaborator berdasarkan board dan user
const getCollaboratorAccessLevel = async (boardId, userId) => {
    const res = await pool.query(
        'SELECT access_level FROM Collaborators WHERE board_id = $1 AND user_id = $2',
        [boardId, userId]
    );
    return res.rows.length ? res.rows[0].access_level : null;
};

// Menghapus collaborator
const removeCollaborator = async (collaboratorId) => {
    await pool.query('DELETE FROM Collaborators WHERE id = $1', [collaboratorId]);
};

module.exports = { getCollaboratorsByBoardId, addCollaborator, removeCollaborator,getCollaboratorAccessLevel };
