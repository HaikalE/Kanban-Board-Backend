const { getBoardsByUserId, createBoard, getCollaboratorBoardsByUserId } = require('../models/boardModel');

const fetchCollaboratorBoards = async (req, res) => {
    try {
        const userId = req.user.id;
        const boards = await getCollaboratorBoardsByUserId(userId);
        res.json(boards);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Mengambil semua board milik pengguna
const fetchBoards = async (req, res) => {
    try {
        const userId = req.user.id;  // Ambil user id dari middleware auth
        const boards = await getBoardsByUserId(userId);
        res.json(boards);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Menambahkan board baru
const addBoard = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;  // Ambil user id dari middleware auth
        const newBoard = await createBoard(name, userId);
        res.status(201).json(newBoard);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { fetchBoards, addBoard,fetchCollaboratorBoards };
