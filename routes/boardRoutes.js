const express = require('express');
const { fetchBoards, addBoard,fetchCollaboratorBoards } = require('../controllers/boardController');
const { fetchBoardDetail } = require('../controllers/boardDetailController');
const authMiddleware = require('../middleware/authMiddleware');
const { checkAccessLevel } = require('../middleware/accessLevelMiddleware');


const router = express.Router();

// Mendapatkan board berdasarkan pengguna
router.get('/boards', authMiddleware, fetchBoards);
router.get('/boards/:boardId', authMiddleware, checkAccessLevel(['viewer','editor','admin']), fetchBoardDetail);
// Menambahkan board baru
router.post('/boards', authMiddleware, addBoard);
router.get('/collaborator-boards', authMiddleware, fetchCollaboratorBoards);

module.exports = router;

