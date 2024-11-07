const { getCardsByColumnId, createCard, updateCard, deleteCard, getCardById, shiftCardPositions, updateCardPositionAndColumn, rearrangeCardsInColumn } = require('../models/cardModel');

// Mendapatkan kartu-kartu berdasarkan column ID
const getCards = async (req, res) => {
    try {
        const { columnId } = req.params;
        const cards = await getCardsByColumnId(columnId);
        res.json(cards);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Menambahkan kartu baru
const addCard = async (req, res) => {
    try {
        const { title, description, position } = req.body;
        const { columnId } = req.params;
        const newCard = await createCard(title, description, position, columnId);
        res.status(201).json(newCard);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Memperbarui kartu
const editCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const { title, description } = req.body;
        const updatedCard = await updateCard(cardId, title, description);
        res.json(updatedCard);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


// Menghapus kartu
const removeCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        await deleteCard(cardId);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const moveCard = async (req, res) => {
    try {
        const { cardId } = req.params;
        const { sourceColumnId, targetColumnId, newPosition } = req.body;

        console.log(`Moving card ${cardId} from column ${sourceColumnId} to column ${targetColumnId} at position ${newPosition}`);

        // Step 1: Dapatkan detail kartu yang sedang dipindahkan
        const cardToMove = await getCardById(cardId);
        if (!cardToMove) {
            return res.status(404).json({ message: 'Card not found' });
        }

        const oldPosition = cardToMove.position;
        console.log(`Card ${cardId} has old position ${oldPosition} in column ${sourceColumnId}`);

        // Step 2: Cek apakah pindah dalam kolom yang sama atau kolom yang berbeda
        if (sourceColumnId === targetColumnId) {
            // Pindah dalam kolom yang sama
            console.log(`Moving card within the same column: ${sourceColumnId}`);
            await shiftCardPositions(targetColumnId, oldPosition, newPosition);
        } else {
            // Pindah antar kolom
            console.log(`Moving card to a different column: from ${sourceColumnId} to ${targetColumnId}`);
            // Geser posisi kartu lain di kolom target
            await shiftCardPositions(targetColumnId, undefined, newPosition);

            // Rapikan kartu di kolom asal
            await rearrangeCardsInColumn(sourceColumnId, oldPosition);
        }

        // Step 3: Update kolom dan posisi dari kartu yang dipindahkan
        await updateCardPositionAndColumn(cardId, targetColumnId, newPosition);

        // Tambahkan pengembalian kartu yang dipindahkan ke dalam response
        const updatedCard = await getCardById(cardId); // Dapatkan data terbaru dari kartu
        res.json({ message: 'Card moved successfully', updatedCard });
    } catch (err) {
        console.error(`Error moving card: ${err.message}`);
        res.status(500).json({ message: 'Server error' });
    }
};





module.exports = { getCards, addCard, editCard, removeCard, moveCard };
