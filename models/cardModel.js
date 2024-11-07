const pool = require('../config/db');

// Mendapatkan semua kartu berdasarkan column ID
const getCardsByColumnId = async (columnId) => {
    const res = await pool.query('SELECT * FROM Cards WHERE column_id = $1 ORDER BY position', [columnId]);
    return res.rows;
};

// Menambahkan kartu baru ke kolom
const createCard = async (title, description, position, columnId) => {
    const res = await pool.query(
        'INSERT INTO Cards (title, description, position, column_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, description, position, columnId]
    );
    return res.rows[0];
};

// Memperbarui kartu
const updateCard = async (cardId, title, description) => {
    const res = await pool.query(
        'UPDATE Cards SET title = $1, description = $2 WHERE id = $3 RETURNING *',
        [title, description, cardId]
    );
    return res.rows[0];
};


// Menghapus kartu
const deleteCard = async (cardId) => {
    await pool.query('DELETE FROM Cards WHERE id = $1', [cardId]);
};

const getCardById = async (cardId) => {
    const res = await pool.query('SELECT * FROM Cards WHERE id = $1', [cardId]);
    return res.rows[0];
};

const shiftCardPositions = async (columnId, oldPosition, newPosition) => {
    if (oldPosition === undefined) {
        // Kalau kartu baru masuk ke kolom target (pindah antar kolom)
        await pool.query(
            'UPDATE Cards SET position = position + 1 WHERE column_id = $1 AND position >= $2',
            [columnId, newPosition]
        );
    } else if (newPosition < oldPosition) {
        // Pindah ke posisi lebih kecil
        await pool.query(
            'UPDATE Cards SET position = position + 1 WHERE column_id = $1 AND position >= $2 AND position < $3',
            [columnId, newPosition, oldPosition]
        );
    } else if (newPosition > oldPosition) {
        // Pindah ke posisi lebih besar
        await pool.query(
            'UPDATE Cards SET position = position - 1 WHERE column_id = $1 AND position > $2 AND position <= $3',
            [columnId, oldPosition, newPosition]
        );
    }
};



const updateCardPositionAndColumn = async (cardId, columnId, newPosition) => {
    console.log(`Updating card ${cardId} to column ${columnId} with new position ${newPosition}`);
    await pool.query(
        'UPDATE Cards SET column_id = $1, position = $2 WHERE id = $3',
        [columnId, newPosition, cardId]
    );
};


const rearrangeCardsInColumn = async (columnId, oldPosition) => {
    console.log(`Rearranging cards in column ${columnId} after removing card from position ${oldPosition}`);
    await pool.query(
        'UPDATE Cards SET position = position - 1 WHERE column_id = $1 AND position > $2',
        [columnId, oldPosition]
    );
};




module.exports = { getCardsByColumnId, createCard, updateCard, deleteCard,getCardById, shiftCardPositions, updateCardPositionAndColumn, rearrangeCardsInColumn};
