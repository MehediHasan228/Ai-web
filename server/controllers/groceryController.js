const prisma = require('../prismaClient');

// @desc Get all grocery items
// @route GET /api/grocery
exports.getGroceryItems = async (req, res) => {
    try {
        const items = await prisma.groceryItem.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc Add grocery item
// @route POST /api/grocery
exports.addGroceryItem = async (req, res) => {
    try {
        const newItem = await prisma.groceryItem.create({
            data: {
                ...req.body,
                userId: req.user?.id
            }
        });
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc Update grocery item
// @route PUT /api/grocery/:id
exports.updateGroceryItem = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updatedItem = await prisma.groceryItem.update({
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

// @desc Delete grocery item
// @route DELETE /api/grocery/:id
exports.deleteGroceryItem = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await prisma.groceryItem.delete({
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

// @desc Toggle grocery item bought status
// @route PATCH /api/grocery/:id/toggle
exports.toggleGroceryItem = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const item = await prisma.groceryItem.findUnique({ where: { id } });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        const updatedItem = await prisma.groceryItem.update({
            where: { id },
            data: { isBought: !item.isBought }
        });
        res.json(updatedItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc Clear completed items
// @route POST /api/grocery/clear
exports.clearCompleted = async (req, res) => {
    try {
        await prisma.groceryItem.deleteMany({
            where: { isBought: true }
        });
        res.json({ message: 'Completed items removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
