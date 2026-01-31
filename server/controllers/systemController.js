const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getStats = async (req, res) => {
    try {
        // 1. User Stats
        const totalUsers = await prisma.user.count();
        const planDistribution = await prisma.user.groupBy({
            by: ['plan'],
            _count: {
                id: true
            }
        });

        // 2. Inventory Stats
        const inventory = await prisma.item.findMany();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const expiringSoon = inventory.filter(item => {
            if (!item.expiry) return false;
            const exp = new Date(item.expiry);
            exp.setHours(0, 0, 0, 0);
            const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
            return diffDays >= 0 && diffDays <= 7;
        }).length;

        const expired = inventory.filter(item => {
            if (!item.expiry) return false;
            const exp = new Date(item.expiry);
            exp.setHours(0, 0, 0, 0);
            return exp < today;
        }).length;

        const locationStats = await prisma.item.groupBy({
            by: ['location'],
            _count: { id: true }
        });

        // 3. Grocery Stats
        const groceryItems = await prisma.groceryItem.findMany({
            where: { isBought: false }
        });
        const estimatedBudget = groceryItems.reduce((acc, item) => acc + (item.price || 0), 0);

        // 4. Recipe Stats
        const totalRecipes = await prisma.recipe.count();

        // 5. Activity Log (Top 5 most recent across models)
        const [recentUsers, recentRecipes, recentItems] = await Promise.all([
            prisma.user.findMany({ take: 3, orderBy: { createdAt: 'desc' }, select: { name: true, createdAt: true } }),
            prisma.recipe.findMany({ take: 3, orderBy: { createdAt: 'desc' }, select: { title: true, createdAt: true } }),
            prisma.item.findMany({ take: 3, orderBy: { createdAt: 'desc' }, select: { name: true, createdAt: true, location: true } })
        ]);

        res.json({
            users: {
                total: totalUsers,
                plans: planDistribution
            },
            inventory: {
                total: inventory.length,
                expiringSoon,
                expired,
                locations: locationStats
            },
            grocery: {
                estimatedBudget
            },
            recipes: {
                total: totalRecipes
            },
            recentActivity: {
                users: recentUsers,
                recipes: recentRecipes,
                items: recentItems
            }
        });
    } catch (error) {
        console.error('Failed to fetch system stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getStats
};
