const mongoose = require("mongoose");

const CLUSTER = process.env.MONGODB_CLUSTER;
const mongoDbURI = `${CLUSTER}`;
// important links
// //www.youtube.com/watch?v=u9kxYilQ9l8.
// https://www.youtube.com/watch?v=_svzevhv4vg
https: mongoose
  .connect(mongoDbURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) =>
    console.log("Error connecting to MongoDB: " + error.message)
  );

mongoose.connection.on("connected", () => {
  console.log("Successfully Connected to MongoDB");
});

mongoose.connection.on("error", (error) => {
  console.log("Error connecting to MongoDB: " + error.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

// CLoses the connection when Server is disconnected
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
