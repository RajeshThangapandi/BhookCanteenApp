import { Recipe } from '../types/Recipe';

export const fetchRecipes = async (category: string, searchQuery: string): Promise<Recipe[]> => {
  try {
    const response = await fetch('https://dummyjson.com/recipes');
    const data = await response.json();

    const transformedRecipes: Recipe[] = data.recipes.map((recipe: any) => ({
      id: recipe.id,
      name: recipe.name,
      price: Math.floor(Math.random() * 300) + 150,
      image: recipe.image,
      quantity: Math.floor(Math.random() * 10) + 1,
      mealType: recipe.mealType || [],
    }));

    return transformedRecipes.filter((recipe: Recipe) =>
      recipe.mealType.map(type => type.toLowerCase()).includes(category.toLowerCase()) &&
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

