import api from "../api";

export const uploadPointsByFile = async (file: File) => {
  try {
    const data = new FormData();
    data.append("file", file);

    await api.post("/points/file", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("[services] uploadPointsByFile Error:", error);
    throw error;
  }
};

export const uploadPointsByWebpage = async (url: string) => {
  try {
    await api.post(
      "/points/webpage",
      { url },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("[services] uploadPointsByWebpage Error:", error);
    throw error;
  }
};

export const uploadPointsByWebsite = async (url: string) => {
  try {
    await api.post(
      "/points/website",
      { url },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("[services] uploadPointsByWebsite Error:", error);
    throw error;
  }
};
