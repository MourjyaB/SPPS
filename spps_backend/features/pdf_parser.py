import pdfplumber
import re

def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

def extract_questions(text):
    subject_match = re.search(r"Subject\s*[-–:]\s*(.+)", text)
    if not subject_match:
        return []
    subject = subject_match.group(1).strip().lower()
    question_blocks = re.split(r"Question\s+\d+\s*:", text)
    questions = []
    for block in question_blocks[1:]:
        try:
            question_match = re.search(r"^(.*?)Option A:", block, re.DOTALL) 
            option_a_match = re.search(r"Option A:\s*(.*?)\n", block)
            option_b_match = re.search(r"Option B:\s*(.*?)\n", block)
            option_c_match = re.search(r"Option C:\s*(.*?)\n", block)
            option_d_match = re.search(r"Option D:\s*(.*?)\n", block)
            correct_answer_match = re.search(r"Correct Answer:\s*(.*?)\n", block)
            explanation_match = re.search(r"Explanation:\s*(.*?)Difficulty Level:", block, re.DOTALL)
            difficulty_level_match = re.search(r"Difficulty Level:\s*(\w)", block)

            question_data = {
                "subject": subject,
                "question": question_match.group(1).strip() if question_match else "",
                "option_a": option_a_match.group(1).strip() if option_a_match else "",
                "option_b": option_b_match.group(1).strip() if option_b_match else "",
                "option_c": option_c_match.group(1).strip() if option_c_match else "",
                "option_d": option_d_match.group(1).strip() if option_d_match else "",
                "correct_option": correct_answer_match.group(1).strip() if correct_answer_match else "",
                "explanation": explanation_match.group(1).strip() if explanation_match else "",
                "difficulty_level": difficulty_level_match.group(1).strip() if difficulty_level_match else ""
            }

            questions.append(question_data)
            
        except Exception as e:
            print ("Failed to parse question:")
            print (block)    
            print("Error: {}".format(e))
    return questions
