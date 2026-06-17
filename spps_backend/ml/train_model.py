import os
import joblib
from dotenv import load_dotenv
from sqlalchemy import create_engine 
import pandas as pd 
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error 

load_dotenv()

ML_DATABASE_URL = os.getenv("ML_DATABASE_URL") 

engine = create_engine(ML_DATABASE_URL)

df = pd.read_sql(' SELECT * FROM "Student_marks" ', engine)

print (df.head()) #debug print
print(f"Rows loaded: {len(df)}") #debug print

#Model training
difficulty_map = {'E': 0, 'M': 1, 'D': 2}
df['difficulty_level'] = df['difficulty_level'].map(difficulty_map)
X = df[['exam1', 'exam2', 'exam3', 'exam4', 'exam5', 'difficulty_level']]
y = df['exam6']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestRegressor(n_estimators=200, random_state=42)
model.fit(X_train, y_train)
predictions = model.predict(X_test)
mae = mean_absolute_error(y_test, predictions)
print(f"MAE: {mae:.2f}") 
joblib.dump(model, 'ml/student_prediction_model.pkl')
print("Model saved successfully.")