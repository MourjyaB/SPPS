import joblib
import pandas as pd 

#Load trained model
model = joblib.load('ml/student_prediction_model.pkl')

def predict_student_performance(exam1, exam2, exam3, exam4, exam5, difficulty_level):
    data = pd.DataFrame([{
        'exam1': exam1,
        'exam2': exam2,
        'exam3': exam3,
        'exam4': exam4,
        'exam5': exam5,
        'difficulty_level': difficulty_level
    }])
    prediction = model.predict(data)
    return round(prediction[0], 2)

#Example usage
if __name__ == "__main__":
    print(f"Predicted Exam 6 Score : {predict_student_performance(95, 96, 94, 97, 98, 0)}") #Case 1 (Topper Student)
    print(f"Predicted Exam 6 Score : {predict_student_performance(15, 18, 12, 20, 17, 2)}") #Case 2 (Weak Student)
    print(f"Predicted Exam 6 Score : {predict_student_performance(20, 35, 50, 70, 90, 1)}") #Case 3 (Improving Student)
    print(f"Predicted Exam 6 Score : {predict_student_performance(95, 85, 75, 55, 35, 1)}") #Case 4 (Declining Student)
    print(f"Predicted Exam 6 Score : {predict_student_performance(95, 20, 90, 25, 85, 1)}") #Case 5 (Inconsistent Student)
    print(f"Predicted Exam 6 Score : {predict_student_performance(70, 70, 70, 70, 70, 0)}") #Case 6 (Average Student on Easy Difficulty)
    print(f"Predicted Exam 6 Score : {predict_student_performance(70, 70, 70, 70, 70, 1)}") #Case 7 (Average Student on Medium Difficulty)
    print(f"Predicted Exam 6 Score : {predict_student_performance(70, 70, 70, 70, 70, 2)}") #Case 8 (Average Student on Hard Difficulty)
