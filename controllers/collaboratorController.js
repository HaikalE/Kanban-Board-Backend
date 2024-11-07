const { getCollaboratorsByBoardId, addCollaborator, removeCollaborator } = require('../models/collaboratorModel');

// Mengambil semua collaborator dari board
const fetchCollaborators = async (req, res) => {
    try {
        const boardId = req.params.boardId;
        const collaborators = await getCollaboratorsByBoardId(boardId);
        res.json({ collaborators });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Menambahkan collaborator baru ke board
const inviteCollaborator = async (req, res) => {
    try {
        const { email, accessLevel } = req.body;
        const boardId = req.params.boardId;

        // Cari user berdasarkan email
        // const user = await User.findOne({ where: { email } });
        // if (!user) {
        //     return res.status(404).json({ message: 'User not found' });
        // }

        // Tambahkan user sebagai kolaborator
        const newCollaborator = await addCollaborator(boardId, email, accessLevel);
        res.status(201).json({ collaborator: newCollaborator });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Menghapus collaborator dari board
const removeCollaboratorFromBoard = async (req, res) => {
    try {
        const { collaboratorId } = req.params; // Assuming 'collaboratorId' is passed as a URL parameter
        await removeCollaborator(collaboratorId);
        res.json({ message: 'Collaborator removed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { fetchCollaborators, inviteCollaborator, removeCollaboratorFromBoard };
