# ChemSynth Technical Guide: PubChem API Integration

This guide provides the technical specifications for integrating the PubChem API into the ChemSynth Raw Material Database (RMD). This integration automates the retrieval of chemical properties, safety data, and identification codes.

---

## 1. Overview of PubChem APIs
PubChem provides two primary RESTful interfaces that we will use:
1.  **PUG REST**: Best for structured, pre-computed data (Molecular Weight, IUPAC Name, Molecular Formula).
2.  **PUG View**: Required for unstructured or experimental data (Density, GHS Hazard Statements, Melting Point).

---

## 2. Core Integration Workflows

### A. Identification (Name to CID)
To pull data, we first need the PubChem Compound ID (CID).
*   **Endpoint:** `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{NAME}/cids/JSON`
*   **Example:** `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/sorbitol/cids/JSON`

### B. Fixed Property Retrieval (PUG REST)
Use this to populate the primary RMD fields.
*   **Endpoint:** `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/{CID}/property/{PROPERTIES}/JSON`
*   **Properties to Fetch:** `MolecularFormula,MolecularWeight,IUPACName,InChIKey,CanonicalSMILES`
*   **Example Request:**
    ```bash
    curl "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/5785/property/MolecularWeight,MolecularFormula,IUPACName,InChIKey/JSON"
    ```

### C. Experimental & Safety Data (PUG View)
Use this for the more complex chemical specs and GHS labels.
*   **Endpoint:** `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/{CID}/JSON`
*   **Data Extraction Logic:**
    *   **Density:** Search the JSON for `TOCHeading: "Density"`. Note that density often includes temperature (e.g., "1.56 g/cm3 at 20°C").
    *   **GHS Classification:** Search for `TOCHeading: "GHS Classification"`. Extract `Pictogram(s)`, `Signal`, and `GHS Hazard Statements`.

---

## 3. Implementation Example (Python)

```python
import requests

def get_chemical_data(name):
    # 1. Get CID
    cid_url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{name}/cids/JSON"
    cid_res = requests.get(cid_url).json()
    cid = cid_res['IdentifierList']['CID'][0]

    # 2. Get Properties
    prop_url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/{cid}/property/MolecularWeight,MolecularFormula,IUPACName/JSON"
    prop_data = requests.get(prop_url).json()['PropertyTable']['Properties'][0]

    # 3. Get Safety/Density (PUG View)
    view_url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/{cid}/JSON"
    view_data = requests.get(view_url).json()

    # Logic to parse PUG View sections...

    return {
        "cid": cid,
        "mw": prop_data['MolecularWeight'],
        "formula": prop_data['MolecularFormula'],
        "name": prop_data['IUPACName']
    }
```

---

## 4. Field Mapping Guide

| ChemSynth Field | PubChem Source | API Type |
| :--- | :--- | :--- |
| **CAS Number** | Synonyms List | PUG REST |
| **Molecular Weight** | `MolecularWeight` | PUG REST |
| **Density** | `Density` section | PUG View |
| **Safety Pictograms** | `Pictogram(s)` markup | PUG View |
| **Hazard Statements** | `GHS Hazard Statements` | PUG View |
| **IUPAC Name** | `IUPACName` | PUG REST |

---

## 5. Usage Policy & Throttling
PubChem is a free service but has usage limits:
*   **Rate Limit:** No more than 5 requests per second.
*   **Timeout:** Requests taking >30 seconds will be aborted by the server.
*   **Caching:** ChemSynth should cache retrieved data in its own database to avoid redundant API calls.
