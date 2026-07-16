import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
    confusion_matrix,
    classification_report,
    ConfusionMatrixDisplay
)

print("Loading Dataset...")

# --------------------------------------------
# Load Dataset
# --------------------------------------------

df = pd.read_csv("Student_marks_rows.csv")

print("Dataset Loaded Successfully!")

print(df.head())

print(f"\nRows Loaded : {len(df)}")

# --------------------------------------------
# Same mapping used during training
# --------------------------------------------

difficulty_map = {
    "E": 0,
    "M": 1,
    "D": 2
}

df["difficulty_level"] = df["difficulty_level"].map(
    difficulty_map
)

# --------------------------------------------
# Features
# --------------------------------------------

X = df[
    [
        "exam1",
        "exam2",
        "exam3",
        "exam4",
        "exam5",
        "difficulty_level"
    ]
]

y = df["exam6"]

# --------------------------------------------
# EXACT SAME TRAIN TEST SPLIT
# AS train_model.py
# --------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(

    X,

    y,

    test_size=0.20,

    random_state=42

)

print("\nTrain/Test Split Completed!")

print(f"Training Samples : {len(X_train)}")

print(f"Testing Samples  : {len(X_test)}")

# =====================================================
# LOAD TRAINED MODEL
# =====================================================

print("\nLoading Trained Model...")

model = joblib.load("spps_backend/ml/student_prediction_model.pkl")

print("Model Loaded Successfully!")

# =====================================================
# PREDICT
# =====================================================

predictions = model.predict(X_test)

print("\nPrediction Completed!")

# =====================================================
# REGRESSION METRICS
# =====================================================

mae = mean_absolute_error(y_test, predictions)
mse = mean_squared_error(y_test, predictions)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, predictions)

print("\n========================================")
print("REGRESSION METRICS")
print("========================================")

print(f"MAE  : {mae:.2f}")
print(f"MSE  : {mse:.2f}")
print(f"RMSE : {rmse:.2f}")
print(f"R²   : {r2:.4f}")

# =====================================================
# PREDICTED VS ACTUAL PLOT
# =====================================================

plt.figure(figsize=(7,6))

plt.scatter(y_test, predictions, alpha=0.7)

plt.plot(
    [y_test.min(), y_test.max()],
    [y_test.min(), y_test.max()],
    color="red",
    linestyle="--",
    linewidth=2
)

plt.xlabel("Actual Marks")
plt.ylabel("Predicted Marks")
plt.title("Predicted vs Actual Marks")

plt.grid(True)

plt.tight_layout()

plt.savefig(
    "predicted_vs_actual.png",
    dpi=300
)

plt.close()

# =====================================================
# RESIDUAL PLOT
# =====================================================

residuals = y_test - predictions

plt.figure(figsize=(7,6))

plt.scatter(
    predictions,
    residuals,
    alpha=0.7
)

plt.axhline(
    y=0,
    color="red",
    linestyle="--"
)

plt.xlabel("Predicted Marks")
plt.ylabel("Residual")

plt.title("Residual Plot")

plt.grid(True)

plt.tight_layout()

plt.savefig(
    "residual_plot.png",
    dpi=300
)

plt.close()

# =====================================================
# RESIDUAL DISTRIBUTION
# =====================================================

plt.figure(figsize=(7,6))

plt.hist(
    residuals,
    bins=20,
    edgecolor="black"
)

plt.xlabel("Residual")

plt.ylabel("Frequency")

plt.title("Residual Distribution")

plt.grid(True)

plt.tight_layout()

plt.savefig(
    "residual_distribution.png",
    dpi=300
)

plt.close()

# =====================================================
# CONVERT MARKS TO CLASSES
# =====================================================

def performance(score):

    if score >= 80:
        return "Excellent"
    elif score >= 60:
        return "Average"
    elif score >= 40:
        return "Below Average"
    else:
        return "Poor"


actual = y_test.apply(performance)

predicted = pd.Series(predictions).apply(performance)

# =====================================================
# CONFUSION MATRIX
# =====================================================

labels = [
    "Poor",
    "Below Average",
    "Average",
    "Excellent"
]

cm = confusion_matrix(
    actual,
    predicted,
    labels=labels
)

print("\n========================================")
print("CONFUSION MATRIX")
print("========================================")

print(cm)

# =====================================================
# CLASSIFICATION REPORT
# =====================================================

print("\n========================================")
print("CLASSIFICATION REPORT")
print("========================================")

print(
    classification_report(
        actual,
        predicted,
        labels=labels,
        zero_division=0
    )
)

# =====================================================
# SAVE CONFUSION MATRIX
# =====================================================

fig, ax = plt.subplots(figsize=(8,6))

disp = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=labels
)

disp.plot(
    ax=ax,
    cmap="Blues",
    colorbar=False
)

plt.title("Confusion Matrix")

plt.tight_layout()

plt.savefig(
    "confusion_matrix.png",
    dpi=300,
    bbox_inches="tight"
)

print("\nConfusion Matrix saved as confusion_matrix.png")

plt.show()