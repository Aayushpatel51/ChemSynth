import pytest
from app.logic.stoichiometry import StoichiometryEngine, Ingredient, Recipe, ReactionStep

def test_calculate_batch_scaling():
    engine = StoichiometryEngine()

    # Mock data for Sorbitan Monolaurate (simplified)
    ingredients = [
        Ingredient(name="Sorbitol", molar_mass=182.17, purity=0.70, density=1.28),
        Ingredient(name="Lauric Acid", molar_mass=200.32, purity=0.99, density=0.88)
    ]

    recipe = Recipe(
        name="Sorbitan Monolaurate",
        ingredients={"Sorbitol": 1.0, "Lauric Acid": 1.0},
        steps=[]
    )

    target_size = 1000  # 1000 kg
    result = engine.calculate_batch(recipe, ingredients, target_size)

    assert result["target_batch_size_kg"] == 1000
    assert len(result["charges"]) == 2

    # Check that Sorbitol charge is higher than Lauric Acid because of 70% purity
    sorbitol_charge = next(c for c in result["charges"] if c["name"] == "Sorbitol")
    lauric_charge = next(c for c in result["charges"] if c["name"] == "Lauric Acid")

    assert sorbitol_charge["mass_kg"] > lauric_charge["mass_kg"]

    # Total charge should be exactly the target batch size
    assert result["total_charge_kg"] == 1000.0
