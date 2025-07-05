import api from "../api";

export const uploadFile = async (file: File) => {
  try {
    const data = new FormData();
    data.append("file", file);

    await api.post("/points/file", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("[services] uploadFile Error:", error);
    throw error;
  }
};

export const uploadWebpage = async (url: string) => {
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
    console.error("[services] uploadWebpage Error:", error);
    throw error;
  }
};

export const uploadWebsite = async (url: string) => {
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
    console.error("[services] uploadWebsite Error:", error);
    throw error;
  }
};
