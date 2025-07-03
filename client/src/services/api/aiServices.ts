import api from "../api";

export const chat = async (prompt: string) => {
  try {
    const response = await api.post<string | null>(
      "/points/webpage",
      { prompt },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("[services] AI Chatbot Error:", error);
    throw error;
  }
};
