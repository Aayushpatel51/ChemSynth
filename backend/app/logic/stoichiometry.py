from pydantic import BaseModel
from typing import List, Dict

class Ingredient(BaseModel):
    name: str
    molar_mass: float  # g/mol
    purity: float      # as a decimal (0.0 to 1.0)
    density: float     # g/cm3 or kg/L

class ReactionStep(BaseModel):
    step_number: int
    instruction: str
    target_temp: float
    target_vacuum: float  # mmHg

class Recipe(BaseModel):
    name: str
    ingredients: Dict[str, float]  # Name -> Molar Ratio
    steps: List[ReactionStep]

class StoichiometryEngine:
    """
    Core logic for calculating chemical batch charges and yields.
    """

    def calculate_batch(self, recipe: Recipe, ingredients_data: List[Ingredient], target_batch_size_kg: float) -> Dict:
        """
        Scales a recipe based on the target batch size, ingredient purity, and predicts byproduct yield.
        For Esters: R-COOH + R'-OH -> R-COOR' + H2O (Water is the byproduct)
        """
        # 1. Map ingredient names to their data for easy lookup
        data_map = {ing.name: ing for ing in ingredients_data}

        # 2. Calculate the 'Basis' molar mass of the recipe
        total_basis_mass = 0
        for name, molar_ratio in recipe.ingredients.items():
            if name not in data_map:
                raise ValueError(f"Ingredient {name} data missing.")

            ing = data_map[name]
            total_basis_mass += (molar_ratio * ing.molar_mass) / ing.purity

        # 3. Calculate Scaling Factor
        scaling_factor = (target_batch_size_kg * 1000) / total_basis_mass

        # 4. Generate Final Charges and calculate byproduct loss (Water)
        charges = []
        total_actual_mass_g = 0
        water_molar_mass = 18.015

        # For MVP, we assume a 1:1 reaction between the first two ingredients results in 1 mole of water
        # This is a simplification for Esters (Acid + Alcohol)
        if len(recipe.ingredients) >= 2:
            moles_of_reaction = scaling_factor * min(recipe.ingredients.values())
            predicted_water_loss_g = moles_of_reaction * water_molar_mass
        else:
            predicted_water_loss_g = 0

        for name, molar_ratio in recipe.ingredients.items():
            ing = data_map[name]
            charge_mass_g = scaling_factor * (molar_ratio * ing.molar_mass) / ing.purity
            charge_vol_l = (charge_mass_g / 1000) / ing.density

            charges.append({
                "name": name,
                "mass_kg": round(charge_mass_g / 1000, 3),
                "volume_l": round(charge_vol_l, 3)
            })
            total_actual_mass_g += charge_mass_g

        predicted_yield_kg = (total_actual_mass_g - predicted_water_loss_g) / 1000

        return {
            "recipe_name": recipe.name,
            "target_batch_size_kg": target_batch_size_kg,
            "total_charge_kg": round(total_actual_mass_g / 1000, 3),
            "predicted_water_loss_kg": round(predicted_water_loss_g / 1000, 3),
            "predicted_yield_kg": round(predicted_yield_kg, 3),
            "charges": charges
        }
