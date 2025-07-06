import axios from "axios";

type Request = {
  prompt: string;
  sessionId?: string;
};

type Response = {
  message: string;
  sessionId: string;
};

const url = "http://localhost:3001/chat";

const chat = async (data: Request) => {
  try {
    const response = await axios.post<Response>(url, data, {
      headers: { "Content-Type": "application/json" },
      validateStatus: () => true,
    });

    if (response.status === 429) return "rate-limit";
    else if (response.status !== 200) return "error";

    return response.data;
  } catch (error) {
    console.error("[services] AI Chatbot Error:", error);
    throw error;
  }
};

export default chat;
