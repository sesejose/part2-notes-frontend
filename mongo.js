const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.bzoyzkr.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

// After establishing the connection, define the schema and model
// First we define the schema for a note  that is stored in the noteSchema variable.
// The schema tells Mongoose how the note objects are to be stored in the database.

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});
// In the Note model definition, the first "Note" parameter is the singular name of the model.
const Note = mongoose.model("Note", noteSchema);

const note = new Note({
  content: "GET and POST are the most important methods of HTTP protocol",
  important: false,
});

// note.save().then((result) => {
//   console.log("note saved!");
//   mongoose.connection.close();
// });

Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});
