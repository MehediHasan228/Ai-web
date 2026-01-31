const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

const SPOONACULAR_BASE = 'https://api.spoonacular.com/recipes';

const MOCK_RECIPES = [
    {
        id: 716429,
        title: "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs",
        image: "https://spoonacular.com/recipeImages/716429-312x231.jpg",
        readyInMinutes: 45,
        servings: 2,
        cuisines: ["Italian"],
        nutrition: { nutrients: [{ name: "Calories", amount: 584 }] },
        analyzedInstructions: [{
            steps: [
                { step: "Wash the cauliflower and cut into small florets.", ingredients: [{ name: "cauliflower" }] },
                { step: "Cook pasta in boiling salted water.", ingredients: [{ name: "pasta" }] },
                { step: "Sauté garlic and scallions in olive oil.", ingredients: [{ name: "garlic" }, { name: "scallions" }] }
            ]
        }]
    },
    {
        id: 715538,
        title: "What to make for dinner tonight?? Bruschetta Style Pork & Pasta",
        image: "https://spoonacular.com/recipeImages/715538-312x231.jpg",
        readyInMinutes: 35,
        servings: 2,
        cuisines: ["Italian", "Mediterranean"],
        nutrition: { nutrients: [{ name: "Calories", amount: 450 }] },
        analyzedInstructions: [{
            steps: [
                { step: "Cook pasta according to package directions.", ingredients: [{ name: "pasta" }] },
                { step: "Season pork with salt and pepper.", ingredients: [{ name: "pork" }] },
                { step: "Grill pork until cooked through.", ingredients: [{ name: "pork" }] }
            ]
        }]
    },
    {
        id: 644387,
        title: "Garlic and Herb Roasted Chicken",
        image: "https://spoonacular.com/recipeImages/644387-312x231.jpg",
        readyInMinutes: 60,
        servings: 4,
        cuisines: ["American"],
        nutrition: { nutrients: [{ name: "Calories", amount: 380 }] },
        analyzedInstructions: [{
            steps: [
                { step: "Preheat oven to 375°F.", ingredients: [] },
                { step: "Rub chicken with garlic and herbs.", ingredients: [{ name: "chicken" }, { name: "garlic" }] },
                { step: "Roast for 1 hour.", ingredients: [] }
            ]
        }]
    },
    {
        id: 782585,
        title: "Cannellini Bean and Kale Soup",
        image: "https://spoonacular.com/recipeImages/782585-312x231.jpg",
        readyInMinutes: 30,
        servings: 4,
        cuisines: ["Mediterranean"],
        nutrition: { nutrients: [{ name: "Calories", amount: 250 }] },
        analyzedInstructions: [{
            steps: [
                { step: "Sauté onions and garlic.", ingredients: [{ name: "onion" }, { name: "garlic" }] },
                { step: "Add kale and beans with broth.", ingredients: [{ name: "kale" }, { name: "beans" }] },
                { step: "Simmer for 20 minutes.", ingredients: [] }
            ]
        }]
    }
];

// @desc Search recipes via Spoonacular
// @route GET /api/external/recipes/search
exports.searchRecipes = async (req, res) => {
    try {
        const { query, cuisine, diet, type } = req.query;

        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        const apiKey = user?.spoonacularKey || process.env.SPOONACULAR_API_KEY;

        // If no API key, return high-quality mock results instead of an error
        if (!apiKey) {
            console.log('Spoonacular API Key not found. Returning mock data.');
            return res.json({
                results: MOCK_RECIPES.filter(r =>
                    !query || r.title.toLowerCase().includes(query.toLowerCase()) ||
                    r.cuisines.some(c => c.toLowerCase().includes(query.toLowerCase()))
                ),
                totalResults: MOCK_RECIPES.length,
                isMock: true
            });
        }

        const response = await axios.get(`${SPOONACULAR_BASE}/complexSearch`, {
            params: {
                apiKey,
                query,
                cuisine,
                diet,
                type,
                addRecipeInformation: true,
                number: 12
            }
        });

        res.json({ ...response.data, isMock: false });
    } catch (err) {
        console.error('Spoonacular Search Error:', err.response?.data || err.message);
        res.status(err.response?.status || 500).json({
            message: err.response?.data?.message || 'Error searching recipes',
            isError: true
        });
    }
};

// @desc Get Spoonacular recipe details
// @route GET /api/external/recipes/:id
exports.getRecipeDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        const apiKey = user?.spoonacularKey || process.env.SPOONACULAR_API_KEY;

        if (!apiKey) {
            return res.status(400).json({ message: 'Spoonacular API Key not found.' });
        }

        const response = await axios.get(`${SPOONACULAR_BASE}/${id}/information`, {
            params: { apiKey }
        });

        res.json(response.data);
    } catch (err) {
        console.error('Spoonacular Details Error:', err.message);
        res.status(500).json({ message: 'Error fetching recipe details' });
    }
};
