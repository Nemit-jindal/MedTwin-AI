"use client";

import { useState } from "react";

import { predictDiabetes } from "@/services/api";
import { PredictionResponse } from "@/types/prediction";

import PredictionResult from "@/components/PredictionResult";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormDataType } from "@/types/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PredictionFormProps {
  formData: FormDataType;
  setFormData: React.Dispatch<
    React.SetStateAction<FormDataType>

  >;
  healthSummary: string;
  reportText: string;
}

export default function PredictionForm({
  formData,
  setFormData,
  healthSummary,
  reportText,
}: PredictionFormProps) {

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<PredictionResponse | null>(
      null
    );

  const basicFields = [

  {
    name: "Pregnancies",
    label: "Pregnancies",
    step: "1",
    min: 0,
    max: 20,
  },

  {
    name: "Glucose",
    label: "Glucose",
    step: "1",
    min: 40,
    max: 300,
  },

  {
    name: "BloodPressure",
    label: "Blood Pressure",
    step: "1",
    min: 40,
    max: 250,
  },

  {
    name: "BMI",
    label: "BMI",
    step: "0.01",
    min: 10,
    max: 70,
  },

  {
    name: "Age",
    label: "Age",
    step: "1",
    min: 1,
    max: 120,
  },

] as const;

const advancedFields = [

  {
    name: "SkinThickness",
    label: "Skin Thickness",
    step: "1",
    min: 0,
    max: 100,
  },

  {
    name: "Insulin",
    label: "Insulin",
    step: "1",
    min: 0,
    max: 900,
  },

  {
    name: "DiabetesPedigreeFunction",
    label: "Diabetes Pedigree Function",
    step: "0.01",
    min: 0,
    max: 3,
  },

] as const;
  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {

  setFormData({
    ...formData,
    [e.target.name]:
      e.target.value,
  });

};

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();
    if (!formData.Gender) {

  alert(
    "Please select gender"
  );

  return;

}

    try {

      setLoading(true);

      const payload = {
        user_id: Number(localStorage.getItem("user_id")),
        Gender: formData.Gender,
        Pregnancies:
  formData.Gender === "Male"
    ? 0
    : Number(
        formData.Pregnancies
      ),
        Glucose: Number(
          formData.Glucose
        ),
        BloodPressure: Number(
          formData.BloodPressure
        ),
        SkinThickness: Number(
          formData.SkinThickness
        ),
        Insulin: Number(
          formData.Insulin
        ),
        BMI: Number(
          formData.BMI
        ),
        DiabetesPedigreeFunction:
          Number(
            formData.DiabetesPedigreeFunction
          ),
        Age: Number(
          formData.Age
        ),
      };

      console.log(
  "Saving for user:",
  localStorage.getItem("user_id")
);

      const response =
        await predictDiabetes(
          payload
        );

      setResult(response);

    } catch (error: any) {

      console.error(error);

      alert(
        error.response?.data
          ?.detail?.[0]?.msg ||
        "Prediction Failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="space-y-8">

      <Card>

        <CardHeader>

          <CardTitle>
            Patient Information
          </CardTitle>

        </CardHeader>

        <CardContent>

          <form
            onSubmit={
              handleSubmit
            }
            className="
              grid
              md:grid-cols-2
              gap-6
            "
          >
            <div className="space-y-2 md:col-span-2">

  <Label>
    Gender
  </Label>

  <Select
  value={formData.Gender}
  onValueChange={(value) =>
    setFormData({
      ...formData,
      Gender: value,
      Pregnancies:
  value === "Male"
    ? "0"
    : formData.Pregnancies,
    })
  }
>

    <SelectTrigger>
      <SelectValue
  placeholder="Select Gender"
/>
    </SelectTrigger>

    <SelectContent>

      <SelectItem value="Male">
        Male
      </SelectItem>

      <SelectItem value="Female">
        Female
      </SelectItem>

    </SelectContent>

  </Select>

</div>

            {basicFields.map(
              (field) => (

                <div
                  key={
                    field.name
                  }
                  className="
                    space-y-2
                  "
                >

                  <Label
                    htmlFor={
                      field.name
                    }
                  >
                    {
                      field.label
                    }
                  </Label>

                  <Input
  id={field.name}
  name={field.name}
  type="number"
  step={field.step}
  min={field.min}
  max={field.max}

  placeholder={
    field.name === "Pregnancies" &&
    formData.Gender === "Male"
      ? "Not Applicable"
      : `Enter ${field.label}`
  }

  value={
    formData[field.name] || ""
  }

  onChange={handleChange}

  disabled={
    field.name === "Pregnancies" &&
    formData.Gender === "Male"
  }

  required={
    !(
      field.name === "Pregnancies" &&
      formData.Gender === "Male"
    )
  }
/>
                  <p
                    className="
                      text-xs
                      text-muted-foreground
                    "
                  >
                    Allowed range:
                    {" "}
                    {field.min}
                    {" - "}
                    {field.max}
                  </p>

                </div>

              )
            )}
            <Accordion
  type="single"
  collapsible
  className="md:col-span-2"
>

  <AccordionItem value="advanced">

    <AccordionTrigger>

      Advanced Parameters
      (Optional)

    </AccordionTrigger>

    <AccordionContent>

      <div
        className="
          grid
          md:grid-cols-2
          gap-6
          pt-4
        "
      >

        {advancedFields.map(
          (field) => (

            <div
              key={field.name}
              className="space-y-2"
            >

              <Label>
                {field.label}
              </Label>

              <Input
                id={field.name}
                name={field.name}
                type="number"
                step={field.step}
                min={field.min}
                max={field.max}
                placeholder={`Enter ${field.label}`}
                value={
                  formData[field.name]
                }
                onChange={handleChange}
              />

            </div>

          )
        )}

      </div>

    </AccordionContent>

  </AccordionItem>

</Accordion>

            <div
              className="
                md:col-span-2
              "
            >

              <Button
                type="submit"
                className="
                  w-full
                "
                disabled={
                  loading
                }
              >

                {
                  loading
                    ? "Predicting..."
                    : "🧠 Analyze Risk"
                }

              </Button>

            </div>

          </form>

        </CardContent>

      </Card>

      {result && (

        <PredictionResult
          result={result}
          healthSummary={healthSummary}
          reportText={reportText}
        />

      )}

    </div>
  );
}