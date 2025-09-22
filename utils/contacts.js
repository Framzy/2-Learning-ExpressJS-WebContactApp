import fs from "fs";

const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

const dataPath = "./data/contacts.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

// get all contacts
const loadContact = () => {
  const fileBuffer = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};

// find contact
const findContact = (nama) => {
  const contacts = loadContact();
  const contact = contacts.find((contact) => contact.nama === nama);
  return contact;
};

// menuliskan / menimpa file contacts.json
const saveContacts = (contacts) => {
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
};

// menambah data contact
const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);
  saveContacts(contacts);
};

// cek duplikat
const checkDuplicate = (nama) => {
  const contacts = loadContact();
  return contacts.find((contact) => contact.nama === nama);
};

// delete contact
const deleteContact = (nama) => {
  const contacts = loadContact();
  const newContacts = contacts.filter((contact) => contact.nama !== nama);
  saveContacts(newContacts);
};

// update contact
const updateContact = (newContact) => {
  const contacts = loadContact();
  // hilangkan contact lama yang sama dengan contact lama
  const filteredContacts = contacts.filter(
    (contact) => contact.nama !== newContact.oldNama
  );
  // delete old oldNama
  delete newContact.oldNama;

  // tambahkan contact baru
  filteredContacts.push(newContact);

  // simpan perubahan
  saveContacts(filteredContacts);
};

export {
  loadContact,
  findContact,
  addContact,
  checkDuplicate,
  deleteContact,
  updateContact,
};
