const pool = require('../config/db');

// Mendapatkan semua kolom berdasarkan board ID
const getColumnsByBoardId = async (boardId) => {
    const res = await pool.query('SELECT * FROM Columns WHERE board_id = $1 ORDER BY position', [boardId]);
    return res.rows;
};

// Menambahkan kolom baru ke board
const createColumn = async (name, position, boardId) => {
    const res = await pool.query(
        'INSERT INTO Columns (name, position, board_id) VALUES ($1, $2, $3) RETURNING *',
        [name, position, boardId]
    );
    return res.rows[0];
};

// Memperbarui kolom
const updateColumn = async (columnId, name, position) => {
    const res = await pool.query(
        'UPDATE Columns SET name = $1, position = $2 WHERE id = $3 RETURNING *',
        [name, position, columnId]
    );
    return res.rows[0];
};

// Menghapus kolom
const deleteColumn = async (columnId) => {
    await pool.query('DELETE FROM Columns WHERE id = $1', [columnId]);
};

// Update column positions in the database
const updateColumnPositions = async (boardId, updatedColumns) => {
    const queries = updatedColumns.map(column => {
        return pool.query(
            'UPDATE Columns SET position = $1 WHERE id = $2 AND board_id = $3',
            [column.position, column.id, boardId]
        );
    });

    await Promise.all(queries);
};

module.exports = { getColumnsByBoardId, createColumn, updateColumn, deleteColumn,updateColumnPositions };
