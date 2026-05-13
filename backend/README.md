# ChemSynth Backend: Stoichiometry Engine

The backend core of ChemSynth provides the high-precision logic required for chemical synthesis protocols, focusing on specialty intermediates like Sorbitan and Glycerol esters.

## Features
- **Stoichiometry Engine**: Handles molar scaling for multi-step reactions.
- **Purity Adjustment**: Automatically calculates raw material requirements based on ingredient purity (e.g., Sorbitol 70%).
- **Byproduct Prediction**: Calculates theoretical yields by accounting for byproduct loss (e.g., water removal in dehydration).
- **Yield Forecasting**: Predicts final mass based on reactor capacity and stoichiometry.

## Prerequisites
- Python 3.12 or higher
- pip (Python package manager)

## Setup Instructions

1. **Create a Virtual Environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Running the API Server

The backend includes a FastAPI server to provide the stoichiometry logic via HTTP.

1. **Start the Server**:
   ```bash
   PYTHONPATH=. python3 app/main.py
   ```
   The API will be available at `http://localhost:8000`.

2. **API Documentation**:
   Once the server is running, you can access the interactive Swagger docs at `http://localhost:8000/docs`.

## Running Tests

The logic is verified using `pytest`. To run the test suite:

```bash
python3 -m pytest tests/test_stoichiometry.py
```

## Project Structure
- `app/logic/`: Contains the core `stoichiometry.py` engine.
- `tests/`: Unit tests for chemical logic.

## Roadmap
- **API Integration**: Implement FastAPI endpoints in `main.py` to serve the engine to the frontend.
- **Database**: Integrate PostgreSQL for storing ingredient specs and recipe templates.
