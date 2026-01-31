const prisma = require('./prismaClient');
const bcrypt = require('bcryptjs');

async function seed() {
    console.log('🌱 Seeding database with demo data...');

    // Clear existing data
    await prisma.groceryItem.deleteMany();
    await prisma.recipe.deleteMany();
    await prisma.item.deleteMany();
    await prisma.user.deleteMany();

    // Create demo users
    const hashedPassword = await bcrypt.hash('demo123', 10);

    const adminUser = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@savora.com',
            password: hashedPassword,
            role: 'admin',
            status: 'Active',
            plan: 'Premium'
        }
    });

    const demoUser = await prisma.user.create({
        data: {
            name: 'Demo User',
            email: 'demo@savora.com',
            password: hashedPassword,
            role: 'user',
            status: 'Active',
            plan: 'Free'
        }
    });

    console.log('✅ Created users');

    // Create inventory items
    const inventoryItems = [
        { name: 'Chicken Breast', category: 'Meat', qty: '500g', expiry: '2026-02-05', status: 'Fresh', location: 'Fridge', userId: adminUser.id },
        { name: 'Eggs', category: 'Dairy', qty: '12 pcs', expiry: '2026-02-10', status: 'Fresh', location: 'Fridge', userId: adminUser.id },
        { name: 'Milk', category: 'Dairy', qty: '1L', expiry: '2026-02-03', status: 'Expiring Soon', location: 'Fridge', userId: adminUser.id },
        { name: 'Rice', category: 'Grains', qty: '2kg', expiry: '2026-06-15', status: 'Fresh', location: 'Pantry', userId: adminUser.id },
        { name: 'Tomatoes', category: 'Vegetables', qty: '6 pcs', expiry: '2026-02-02', status: 'Expiring Soon', location: 'Fridge', userId: adminUser.id },
        { name: 'Onions', category: 'Vegetables', qty: '1kg', expiry: '2026-02-20', status: 'Fresh', location: 'Pantry', userId: adminUser.id },
        { name: 'Garlic', category: 'Vegetables', qty: '200g', expiry: '2026-02-25', status: 'Fresh', location: 'Pantry', userId: adminUser.id },
        { name: 'Olive Oil', category: 'Oils', qty: '500ml', expiry: '2026-12-01', status: 'Fresh', location: 'Pantry', userId: adminUser.id },
        { name: 'Pasta', category: 'Grains', qty: '500g', expiry: '2026-08-15', status: 'Fresh', location: 'Pantry', userId: adminUser.id },
        { name: 'Cheese', category: 'Dairy', qty: '250g', expiry: '2026-02-08', status: 'Fresh', location: 'Fridge', userId: adminUser.id },
    ];

    for (const item of inventoryItems) {
        await prisma.item.create({ data: item });
    }
    console.log('✅ Created inventory items');

    // Create recipes
    const recipes = [
        {
            title: 'Chicken Stir Fry',
            cuisine: 'Asian',
            time: 30,
            calories: 450,
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
            ingredients: JSON.stringify(['Chicken Breast', 'Garlic', 'Onions', 'Soy Sauce', 'Vegetables']),
            instructions: '1. Cut chicken into strips. 2. Sauté garlic and onions. 3. Add chicken and cook until done. 4. Add vegetables and soy sauce. 5. Serve hot with rice.',
            userId: adminUser.id
        },
        {
            title: 'Pasta Carbonara',
            cuisine: 'Italian',
            time: 25,
            calories: 650,
            image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
            ingredients: JSON.stringify(['Pasta', 'Eggs', 'Cheese', 'Bacon', 'Garlic']),
            instructions: '1. Cook pasta al dente. 2. Fry bacon until crispy. 3. Mix eggs with cheese. 4. Combine hot pasta with egg mixture. 5. Add bacon and serve.',
            userId: adminUser.id
        },
        {
            title: 'Tomato Rice',
            cuisine: 'Indian',
            time: 35,
            calories: 380,
            image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400',
            ingredients: JSON.stringify(['Rice', 'Tomatoes', 'Onions', 'Garlic', 'Spices']),
            instructions: '1. Sauté onions and garlic. 2. Add chopped tomatoes. 3. Add rice and water. 4. Cook until rice is done. 5. Garnish and serve.',
            userId: adminUser.id
        },
        {
            title: 'Omelette',
            cuisine: 'French',
            time: 10,
            calories: 280,
            image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400',
            ingredients: JSON.stringify(['Eggs', 'Cheese', 'Milk', 'Salt', 'Pepper']),
            instructions: '1. Beat eggs with milk, salt, pepper. 2. Heat butter in pan. 3. Pour egg mixture. 4. Add cheese. 5. Fold and serve.',
            userId: adminUser.id
        },
    ];

    for (const recipe of recipes) {
        await prisma.recipe.create({ data: recipe });
    }
    console.log('✅ Created recipes');

    // Create grocery items
    const groceryItems = [
        { name: 'Bread', category: 'Bakery', isBought: false, price: 2.50, userId: adminUser.id },
        { name: 'Butter', category: 'Dairy', isBought: false, price: 4.00, userId: adminUser.id },
        { name: 'Apples', category: 'Fruits', isBought: true, price: 3.50, userId: adminUser.id },
        { name: 'Orange Juice', category: 'Beverages', isBought: false, price: 5.00, userId: adminUser.id },
        { name: 'Yogurt', category: 'Dairy', isBought: false, price: 3.00, userId: adminUser.id },
        { name: 'Bananas', category: 'Fruits', isBought: true, price: 2.00, userId: adminUser.id },
    ];

    for (const item of groceryItems) {
        await prisma.groceryItem.create({ data: item });
    }
    console.log('✅ Created grocery items');

    console.log('');
    console.log('🎉 Database seeded successfully!');
    console.log('');
    console.log('📧 Demo Login Credentials:');
    console.log('   Admin: admin@savora.com / demo123');
    console.log('   User:  demo@savora.com / demo123');
}

seed()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
