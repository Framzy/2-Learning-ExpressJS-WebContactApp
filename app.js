import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import {
  loadContact,
  findContact,
  addContact,
  checkDuplicate,
  deleteContact,
  updateContact,
} from "./utils/contacts.js";
import { body, check, validationResult } from "express-validator";
import session from "express-session";
import cookieParser from "cookie-parser";
import flash from "connect-flash";

const app = express();
const port = 3000;

app.set("view engine", "ejs"); // gunakan ejs
app.use(expressEjsLayouts); // third-party middleware (created by npm package or third-party)
app.use(express.static("public")); // built-in middleware (created by express itself)
app.use(express.urlencoded({ extended: true })); // built-in middleware (created by express itself)

// konfigurasi flash third
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

// Application level middleware (created by user)
// app.use((req, res, next) => {
//   console.log("Time: ", Date.now());
//   next();
// });

app.get("/", (req, res) => {
  const vocals = {
    layout: "layouts/main-layout",
    title: "Home Page",
    nama: "Farden",
  };
  res.render("index", vocals);
});

app.get("/about", (req, res) => {
  const vocals = {
    layout: "layouts/main-layout",
    title: "About Page",
  };
  res.render("about", vocals);
});

app.get("/contact", (req, res) => {
  const contacts = loadContact();

  const vocals = {
    layout: "layouts/main-layout",
    title: "Contact Page",
    contacts,
    msg: req.flash("msg"),
  };
  res.render("contact", vocals);
});

// form add contact before route detail because get method
app.get("/contact/add", (req, res) => {
  const vocals = {
    layout: "layouts/main-layout",
    title: "Form Tambah Data Contact",
  };
  res.render("add-contact", vocals);
});

// proses add contact ( validator is matches with name form )
app.post(
  "/contact",
  [
    body("nama").custom((value) => {
      const duplicate = checkDuplicate(value);
      if (duplicate) {
        throw new Error("Contact sudah terdaftar, gunakan nama lain !");
      }
      return true;
    }),
    check("noHp", "Nomor Handphone Tidak Valid !").isMobilePhone("id-ID"),
    check("email", "Email Tidak Valid !").isEmail(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        title: "Form Tambah Data Contact",
        layout: "layouts/main-layout",
        errors: errors.array(),
      });
    } else {
      const contact = {
        nama: req.body.nama,
        noHp: req.body.noHp,
        email: req.body.email,
      };
      addContact(contact);

      // flash message
      req.flash("msg", "Data contact berhasil ditambahkan !");
      res.redirect("/contact");
    }
  }
);

// proses delete contact
app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  if (!contact) {
    res.status(404);
    res.send("Contact tidak ditemukan");
  } else {
    deleteContact(req.params.nama);
    // flash message
    req.flash("msg", "Data contact berhasil dihapus !");
    res.redirect("/contact");
  }
});

// form edit contact before route detail because get method
app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  const vocals = {
    layout: "layouts/main-layout",
    title: "Form Ubah Data Contact",
    contact,
  };
  res.render("edit-contact", vocals);
});

// proses edit contact
app.post(
  "/contact/update/",
  [
    body("nama").custom((value, { req }) => {
      const duplicate = checkDuplicate(value);
      if (value !== req.body.oldNama && duplicate) {
        throw new Error("Contact sudah terdaftar, gunakan nama lain !");
      }
      return true;
    }),
    check("noHp", "Nomor Handphone Tidak Valid !").isMobilePhone("id-ID"),
    check("email", "Email Tidak Valid !").isEmail(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit-contact", {
        title: "Form Ubah Data Contact",
        layout: "layouts/main-layout",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      updateContact(req.body);

      // flash message
      req.flash("msg", "Data contact berhasil ditambahkan !");
      res.redirect("/contact");
    }
  }
);

// detail contact page by name
app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  const vocals = {
    layout: "layouts/main-layout",
    title: "Contact Page",
    contact,
  };
  res.render("detail", vocals);
});

app.get("/product/:id", (req, res) => {
  res.render("product");
  res.send(`Product ID : ${req.params.id} <br> 
    Category : ${req.query.category} `);
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("404");
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
