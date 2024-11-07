const { getColumnsByBoardId, createColumn, updateColumn, deleteColumn, updateColumnPositions } = require('../models/columnModel');

// Mendapatkan kolom-kolom berdasarkan board ID
const getColumns = async (req, res) => {
    try {
        const { boardId } = req.params;
        const columns = await getColumnsByBoardId(boardId);
        res.json(columns);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Menambahkan kolom baru
const addColumn = async (req, res) => {
    try {
        const { name, position } = req.body;
        const { boardId } = req.params;
        const newColumn = await createColumn(name, position, boardId);
        res.status(201).json(newColumn);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Memperbarui kolom
const editColumn = async (req, res) => {
    try {
        const { columnId } = req.params;
        const { name, position } = req.body;
        const updatedColumn = await updateColumn(columnId, name, position);
        res.json(updatedColumn);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Menghapus kolom
const removeColumn = async (req, res) => {
    try {
        const { columnId } = req.params;
        await deleteColumn(columnId);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update column positions
const updateColumnPosition = async (req, res) => {
    try {
        columns = req.body; // Ensure columns is correctly passed in the request
        if (!Array.isArray(columns) || !columns.length) {
            return res.status(400).send({ message: "No columns provided or invalid data" });
        }

        // Log the received columns for debugging purposes
        console.log("Received columns for update:", columns);

        // Update the positions in the database
        const { boardId } = req.params;
        await updateColumnPositions(boardId, columns);

        res.status(200).send({ message: "Column positions updated successfully" });
    } catch (err) {
        console.error("Error updating column positions:", err);
        return res.status(500).send({ message: "Failed to update column positions" });
    }
};
  


module.exports = { getColumns, addColumn, editColumn, removeColumn,updateColumnPosition };
