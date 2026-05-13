export interface Ingredient {
  name: string;
  molarMass: number;
  purity: number;
  density: number;
}

export interface Recipe {
  name: string;
  ingredients: Record<string, number>;
}

export const INGREDIENTS_DB: Record<string, Ingredient> = {
  "Sorbitol (70%)": { name: "Sorbitol (70%)", molarMass: 182.17, purity: 0.70, density: 1.28 },
  "Lauric Acid (99%)": { name: "Lauric Acid (99%)", molarMass: 200.32, purity: 0.99, density: 0.88 },
  "Stearic Acid (98%)": { name: "Stearic Acid (98%)", molarMass: 284.48, purity: 0.98, density: 0.84 },
  "Glycerol (99%)": { name: "Glycerol (99%)", molarMass: 92.09, purity: 0.99, density: 1.26 },
};

export const RECIPES: Recipe[] = [
  {
    name: "Sorbitan Monolaurate (Span 20)",
    ingredients: { "Sorbitol (70%)": 1, "Lauric Acid (99%)": 1 }
  },
  {
    name: "Sorbitan Monostearate (Span 60)",
    ingredients: { "Sorbitol (70%)": 1, "Stearic Acid (98%)": 1 }
  },
  {
    name: "Glycerol Monostearate (GMS)",
    ingredients: { "Glycerol (99%)": 1, "Stearic Acid (98%)": 1 }
  }
];

export function calculateBatch(recipeName: string, targetBatchSizeKg: number) {
  const recipe = RECIPES.find(r => r.name === recipeName);
  if (!recipe) return null;

  let totalBasisMass = 0;
  for (const [name, molarRatio] of Object.entries(recipe.ingredients)) {
    const ing = INGREDIENTS_DB[name];
    totalBasisMass += (molarRatio * ing.molarMass) / ing.purity;
  }

  const scalingFactor = (targetBatchSizeKg * 1000) / totalBasisMass;
  const waterMolarMass = 18.015;

  // Predict water loss (assuming 1:1 reaction of first two ingredients)
  const ratios = Object.values(recipe.ingredients);
  const molesOfReaction = scalingFactor * Math.min(...ratios);
  const predictedWaterLossG = molesOfReaction * waterMolarMass;

  const charges = Object.entries(recipe.ingredients).map(([name, molarRatio]) => {
    const ing = INGREDIENTS_DB[name];
    const chargeMassG = scalingFactor * (molarRatio * ing.molarMass) / ing.purity;
    const chargeVolL = (chargeMassG / ing.density) / 1000;

    return {
      name,
      massKg: chargeMassG / 1000,
      volumeL: chargeVolL
    };
  });

  const totalChargeG = charges.reduce((acc, c) => acc + (c.massKg * 1000), 0);
  const predictedYieldKg = (totalChargeG - predictedWaterLossG) / 1000;

  return {
    totalChargeKg: totalChargeG / 1000,
    predictedYieldKg,
    predictedWaterLossKg: predictedWaterLossG / 1000,
    charges
  };
}

export async function apiCalculateBatch(recipeName: string, targetBatchSizeKg: number) {
  const recipe = RECIPES.find(r => r.name === recipeName);
  if (!recipe) return null;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Map frontend ingredients to backend Ingredient model
  const ingredients_data = Object.keys(recipe.ingredients).map(name => {
    const ing = INGREDIENTS_DB[name];
    return {
      name: ing.name,
      molar_mass: ing.molarMass,
      purity: ing.purity,
      density: ing.density
    };
  });

  // Map frontend recipe to backend Recipe model
  const backendRecipe = {
    name: recipe.name,
    ingredients: recipe.ingredients,
    steps: [] // Steps are optional in backend for now
  };

  try {
    const response = await fetch(`${API_URL}/api/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipe: backendRecipe,
        ingredients_data,
        target_batch_size_kg: targetBatchSizeKg
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();

    // Map backend snake_case response back to frontend camelCase
    return {
      totalChargeKg: data.total_charge_kg,
      predictedYieldKg: data.predicted_yield_kg,
      predictedWaterLossKg: data.predicted_water_loss_kg,
      charges: data.charges.map((c: any) => ({
        name: c.name,
        massKg: c.mass_kg,
        volumeL: c.volume_l
      }))
    };
  } catch (error) {
    console.error('Error calling stoichiometry API:', error);
    // Fallback to local calculation if API is unavailable
    return calculateBatch(recipeName, targetBatchSizeKg);
  }
}
