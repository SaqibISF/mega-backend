import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { PORT } from "./constants.js";

connectDB()
  .then(() => {
    app.on("error", (error) => console.log("Server FAILED: ", error));
    app.listen(PORT, () =>
      console.log(`Server is running at http://localhost:${PORT}`)
    );
  })
  .catch((error) => console.error("MONGODB connection FAILED: ", error));

// import express from "express";

// const app = express()(async () => {
//   try {
//     await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
//     app.on("error", (error) => {
//       console.log("ERROR: ", error);
//       throw error;
//     });

//     app.listen(PORT, () => {
//         console.log(`App is listening in port ${PORT}`)

//     });
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// })();
