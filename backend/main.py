import os
import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

# ==============================
# 🔹 Configurar rutas absolutas
# ==============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "car_price_rf_model.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "encoder.pkl")

# ==============================
# 🔹 Cargar modelo y encoder
# ==============================
model = joblib.load(MODEL_PATH)
encoder = joblib.load(ENCODER_PATH)

# ==============================
# 🔹 Inicializar FastAPI
# ==============================
app = FastAPI()

# ==============================
# 🔹 Definir estructura de entrada
# ==============================
class CarInput(BaseModel):
    Velocidades: int
    RPM: int
    Capacidad: int
    Puertas: int
    Consumo: float
    Emisiones: float
    Combustible: str
    Transmision: str
    Carroceria: str
    Pais: str

# ==============================
# 🔹 Endpoint de predicción
# ==============================
@app.post("/predict")
def predict(car: CarInput):
    df = pd.DataFrame([{
        "Velocidades": car.Velocidades,
        "RPM": car.RPM,
        "Capacidad de Pasajeros": car.Capacidad,
        "Número de Puertas": car.Puertas,
        "Consumo (L/100km)": car.Consumo,
        "Emisiones CO2 (g/km)": car.Emisiones,
        "Tipo de Combustible": car.Combustible,
        "Transmisión": car.Transmision,
        "Tipo de Carrocería": car.Carroceria,
        "País de Fabricación": car.Pais
    }])

    # 🔹 Separar características categóricas y numéricas
    cat_features = ["Tipo de Combustible", "Transmisión", "Tipo de Carrocería", "País de Fabricación"]
    num_features = ["Velocidades", "RPM", "Capacidad de Pasajeros", "Número de Puertas",
                    "Consumo (L/100km)", "Emisiones CO2 (g/km)"]

    # 🔹 Codificar categóricas
    encoded_cat = encoder.transform(df[cat_features])
    encoded_cat_df = pd.DataFrame(encoded_cat, columns=encoder.get_feature_names_out(cat_features))

    # 🔹 Combinar todo
    X = pd.concat([df[num_features].reset_index(drop=True), encoded_cat_df.reset_index(drop=True)], axis=1)

    # 🔹 Predicción
    prediction = model.predict(X)[0]
    return {"precio_estimado": round(float(prediction), 2)}

# ==============================
# 🔹 Ejecutar servidor
# ==============================
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
