const prisma = require('../prismaClient');

// @desc Get all inventory items
// @route GET /api/inventory
exports.getItems = async (req, res) => {
    try {
        const items = await prisma.item.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc Add new item
// @route POST /api/inventory
exports.addItem = async (req, res) => {
    try {
        const { name, category, qty, expiry, status, location } = req.body;
        const newItem = await prisma.item.create({
            data: {
                name,
                category,
                qty,
                expiry,
                status,
                location
                // userId: req.user.id // Add this when auth is fully integrated
            }
        });
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc Update item
// @route PUT /api/inventory/:id
exports.updateItem = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updatedItem = await prisma.item.update({
            where: { id },
            data: req.body
        });
        res.json(updatedItem);
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(400).json({ message: err.message });
    }
};

// @desc Delete item
// @route DELETE /api/inventory/:id
exports.deleteItem = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await prisma.item.delete({
            where: { id }
        });
        res.json({ message: 'Item removed successfully' });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(500).json({ message: err.message });
    }
};
