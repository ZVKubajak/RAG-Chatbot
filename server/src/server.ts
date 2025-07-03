import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import qdrant, { collectionName } from "./configs/qdrant";
import routes from "./routes/index";

dotenv.config();

const app = express();
const PORT = process.env.PORT!;

app.use(cors());
app.use(express.json());
app.use(routes);

const initializeCollection = async () => {
  try {
    const collections = await qdrant.getCollections();
    const collectionExists = collections.collections.some(
      (collection) => collection.name === collectionName
    );

    if (!collectionExists) {
      console.log(`Creating collection "${collectionName}"...`);
      await qdrant.createCollection(collectionName, {
        vectors: {
          size: 1536,
          distance: "Cosine",
        },
      });
      console.log(`Collection "${collectionName}" created successfully!`);
    } else {
      console.log(`Collection "${collectionName}" already exists.`);
    }
  } catch (error) {
    console.error("Error initializing collection:", error);
    process.exit(1);
  }
};

const startServer = async () => {
  await initializeCollection();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
  });
};

startServer();
