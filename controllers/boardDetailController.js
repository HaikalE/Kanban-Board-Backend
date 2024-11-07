const { getColumnsByBoardId } = require('../models/columnModel');
const { getCardsByColumnId } = require('../models/cardModel');
const { getBoardByBoardId } = require('../models/boardModel');
const { getCollaboratorByBoardAndUser } = require('../models/userModel');


// Mengambil detail dari board, termasuk kolom dan kartu
const fetchBoardDetail = async (req, res) => {
    try {
        const boardId = req.params.boardId;
        const userId = req.user.id; // Dari JWT atau session


        // Ambil board berdasarkan boardId (asumsinya cuma satu hasil)
        const board = await getBoardByBoardId(boardId);
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        // Cek apakah user adalah owner dari board ini
        let role = 'viewer';
        if (board[0].owner_id === userId) {
            role = 'owner';
        } else {
            // Jika bukan owner, cek role dari tabel Collaborators
            const collaborator = await getCollaboratorByBoardAndUser(boardId, userId);
            if (collaborator) {
                role = collaborator.access_level; // "viewer" atau "editor"
            }
        }

        // Ambil kolom-kolom yang ada di dalam board
        const columns = await getColumnsByBoardId(boardId);

        // Ambil kartu-kartu di dalam setiap kolom
        for (const column of columns) {
            const cards = await getCardsByColumnId(column.id);
            column.cards = cards;
        }

        // Return board sebagai object, bukan array
        res.json({ board, columns, role, user_id: userId });
    } catch (err) {
        console.error(`Error fetching board details: ${err.message}`);
        res.status(500).json({ message: 'Server error' });
    }
};




module.exports = { fetchBoardDetail };
