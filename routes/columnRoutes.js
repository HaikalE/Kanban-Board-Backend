const express = require('express');
const { getColumns, addColumn, editColumn, removeColumn,updateColumnPosition } = require('../controllers/columnController');
const authMiddleware = require('../middleware/authMiddleware');
const { checkAccessLevel } = require('../middleware/accessLevelMiddleware');
const router = express.Router();

// Rute untuk operasi CRUD pada kolom
router.get('/boards/:boardId/columns', authMiddleware, getColumns);
router.post('/boards/:boardId/columns', authMiddleware,checkAccessLevel(['editor','admin']), addColumn);
router.put('/columns/:columnId', authMiddleware, editColumn);
router.delete('/columns/:columnId', authMiddleware, removeColumn);

// Rute untuk memperbarui posisi kolom
router.put('/boards/:boardId/columns/positions', authMiddleware, checkAccessLevel(['editor', 'admin']), updateColumnPosition);

module.exports = router;
