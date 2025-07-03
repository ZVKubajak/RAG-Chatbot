import api from "../api";

export const chat = async (prompt: string) => {
  try {
    const response = await api.post<string | null>(
      "/ai/",
      { prompt },
      {
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: () => true,
      }
    );

    if (response.status !== 200) return null;
    return response.data;
  } catch (error) {
    console.error("[services] AI Chatbot Error:", error);
    throw error;
  }
};
