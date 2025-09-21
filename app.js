import express from "express";

const app = express();
const port = 3000;

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// View Engine
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Web Contact App" });
});

app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  console.log(`Pesan dari ${name} <${email}>: ${message}`);
  res.send("Pesan berhasil dikirim!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
