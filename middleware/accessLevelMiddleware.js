// middleware/accessLevelMiddleware.js
const { getCollaboratorAccessLevel } = require('../models/collaboratorModel');
const pool = require('../config/db');

const checkAccessLevel = (requiredLevels) => {
    return async (req, res, next) => {
        try {  
            const userId = req.user.id;
            const boardId = req.params.boardId;
            
            // Periksa apakah pengguna adalah pemilik board
            const ownerCheck = await pool.query('SELECT owner_id FROM Boards WHERE id = $1', [boardId]);
            if (ownerCheck.rows.length > 0 && ownerCheck.rows[0].owner_id === userId) {
                return next();
            }

            // Periksa level akses pengguna
            const accessLevel = await getCollaboratorAccessLevel(boardId, userId);

            if (!accessLevel) {
                return res.status(403).json({ message: 'Access denied' });
            }

            // Cek apakah accessLevel ada di dalam array requiredLevels
            if (requiredLevels.includes(accessLevel)) {
                return next();
            }

            return res.status(403).json({ message: 'Insufficient permissions' });
        } catch (err) {
            return res.status(500).json({ message: 'Server error' });
        }
    };
};

module.exports = { checkAccessLevel };
