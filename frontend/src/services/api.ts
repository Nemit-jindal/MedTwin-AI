import axios from "axios";
import {
  PredictionRequest,
  PredictionResponse,
} from "@/types/prediction";

 const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";;

export const predictDiabetes = async (
  data: PredictionRequest
): Promise<PredictionResponse> => {

  const response = await axios.post(
  `${API_URL}/predict`,
  data,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);

  return response.data;
};

export const generateReport = async (
  data: any
) => {

  const response =
    await axios.post(
      `${API_URL}/generate-report`,
      data
    );

  return response.data;

};
export const getHistory = async (
  userId: number
) => {

  const response =
    await axios.get(
      `${API_URL}/history/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

  return response.data;
};