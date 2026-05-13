from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from app.logic.stoichiometry import StoichiometryEngine, Ingredient, Recipe

app = FastAPI(title="ChemSynth Stoichiometry API")

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = StoichiometryEngine()

class BatchRequest(BaseModel):
    recipe: Recipe
    ingredients_data: List[Ingredient]
    target_batch_size_kg: float

@app.get("/")
async def root():
    return {"message": "ChemSynth Stoichiometry API is active"}

@app.post("/api/calculate")
async def calculate_batch(request: BatchRequest):
    try:
        result = engine.calculate_batch(
            request.recipe,
            request.ingredients_data,
            request.target_batch_size_kg
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal calculation error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
