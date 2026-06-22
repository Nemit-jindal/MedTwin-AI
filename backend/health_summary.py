def generate_health_summary(
    extracted_values: dict
):

    summary = []

    glucose = extracted_values.get(
        "Glucose"
    )

    bmi = extracted_values.get(
        "BMI"
    )

    bp = extracted_values.get(
        "BloodPressure"
    )

    age = extracted_values.get(
        "Age"
    )

    if glucose:

        if glucose >= 126:

            summary.append(
                f"Glucose level ({glucose} mg/dL) is elevated and may indicate diabetes risk."
            )

        elif glucose >= 100:

            summary.append(
                f"Glucose level ({glucose} mg/dL) suggests prediabetes."
            )

        else:

            summary.append(
                f"Glucose level ({glucose} mg/dL) is within normal range."
            )

    if bmi:

        if bmi >= 30:

            summary.append(
                f"BMI ({bmi}) indicates obesity."
            )

        elif bmi >= 25:

            summary.append(
                f"BMI ({bmi}) indicates overweight."
            )

        else:

            summary.append(
                f"BMI ({bmi}) is within normal range."
            )

    if bp:

        if bp >= 140:

            summary.append(
                f"Blood pressure ({bp}) is high."
            )

        else:

            summary.append(
                f"Blood pressure ({bp}) is within normal range."
            )

    if age:

        if age >= 45:

            summary.append(
                "Age is a significant diabetes risk factor."
            )

    return " ".join(summary)