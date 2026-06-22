import pdfplumber
import pytesseract
import re
pytesseract.pytesseract.tesseract_cmd = (
    r"E:\OCR\tesseract.exe"
)

def extract_text_from_pdf(
    file_path: str
):

    text = ""

    with pdfplumber.open(
        file_path
    ) as pdf:

        for page in pdf.pages:

            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

    return text
def extract_medical_values(
    text: str
):

    extracted = {}

    patterns = {
        "Glucose":
            r"glucose[:\s]+(\d+\.?\d*)",

        "BMI":
            r"bmi[:\s]+(\d+\.?\d*)",

        "Age":
            r"age[:\s]+(\d+)",

        "BloodPressure":
            r"blood\s*pressure[:\s]+(\d+)"
    }

    for field, pattern in patterns.items():

        match = re.search(
            pattern,
            text,
            re.IGNORECASE
        )

        if match:

            extracted[field] = (
                float(match.group(1))
            )

    return extracted

if __name__ == "__main__":

    text = extract_text_from_pdf(
        "uploads/sample_medical_report.pdf"
    )

    values = extract_medical_values(
        text
    )

    print(values)