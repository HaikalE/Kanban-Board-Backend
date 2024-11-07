const { checkAccessLevel } = require('../middleware/accessLevelMiddleware');
const express = require('express');
const { fetchCollaborators, inviteCollaborator, removeCollaboratorFromBoard } = require('../controllers/collaboratorController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Mendapatkan semua collaborator dari board
router.get('/boards/:boardId/collaborators', authMiddleware,fetchCollaborators);

// Menambahkan collaborator baru
router.post('/boards/:boardId/collaborators', authMiddleware,checkAccessLevel(['editor','admin']), inviteCollaborator);

// Menghapus collaborator
router.delete('/boards/:boardId/collaborators/:collaboratorId', authMiddleware,checkAccessLevel(['editor','admin']), removeCollaboratorFromBoard);

module.exports = router;
