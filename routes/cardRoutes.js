const { checkAccessLevel } = require('../middleware/accessLevelMiddleware');

const express = require('express');
const { getCards, addCard, editCard, removeCard, moveCard } = require('../controllers/cardController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router(); 

// Rute untuk operasi CRUD pada kartu
router.get('/columns/:columnId/cards', authMiddleware, getCards);
router.post('/columns/:columnId/boards/:boardId/cards', authMiddleware,checkAccessLevel(['editor','admin']), addCard);
router.put('/cards/:cardId/boards/:boardId', authMiddleware,checkAccessLevel(['editor','admin']), editCard);
router.delete('/cards/:cardId/boards/:boardId', authMiddleware,checkAccessLevel(['editor','admin']) ,removeCard);
router.put('/cards/:cardId/boards/:boardId/move', authMiddleware,checkAccessLevel(['editor','admin']), moveCard);

module.exports = router;
