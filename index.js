/* eslint-env node */
// const mongoose = require("mongoose");

// // DO NOT SAVE YOUR PASSWORD TO GITHUB!!
// const password = process.argv[2];
// const url = `mongodb+srv://fullstack:${password}@cluster0.bzoyzkr.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`;

// mongoose.set("strictQuery", false);
// mongoose.connect(url, { family: 4 });

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// });

// const Note = mongoose.model("Note", noteSchema);

// noteSchema.set("toJSON", {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//   },
// });

////////////////////////////////
require("dotenv").config(); // Always at the very top
const express = require("express");
const Note = require("./models/note"); // Import the Note model
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("dist")); // Serve static files from dist

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

// app.get("/", (request, response) => {
//   response.send("<h1>Hello World!</h1>");
// });

// Let's change the handler for fetching all notes to the following form:
app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

// app.get("/api/notes", (request, response) => {
//   response.json(notes);
// });

// app.get("/api/notes/:id", (request, response) => {
//   const id = Number(request.params.id);
//   const note = notes.find((note) => note.id === id);

//   if (note) {
//     response.json(note);
//   } else {
//     response.status(404).json({ error: "Note not found" });
//   }
// });

// Getting a note with specific ID
// Using Mongoose's findById method, fetching an individual note gets changed into the following:
app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end(); // if a note with the given id doesn't exist, the server will respond to the request with the HTTP status code 404 not found.
      }
    })
    .catch((error) => {
      // simple catch block to handle cases where the promise returned by the findById method is rejected:
      // console.log(error); // When dealing with Promises, it's almost always a good idea to add error and exception handling. Otherwise, you will find yourself dealing with strange bugs.
      // response.status(400).send({ error: "malformatted id" }); // The appropriate status code for the situation is 400 Bad Request (and NOT 500) because the situation fits the description perfectly:
      next(error); // we pass the error to the next middleware - error handler
    });
});

// uodating an specidfic note
app.put("/api/notes/:id", (request, response, next) => {
  const { content, important } = request.body;

  Note.findById(request.params.id)
    .then((note) => {
      if (!note) {
        return response.status(404).end();
      }

      note.content = content;
      note.important = important;

      return note.save().then((updatedNote) => {
        response.json(updatedNote);
      });
    })
    .catch((error) => next(error));
});

// app.post("/api/notes", (request, response) => {
//   const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;

//   const note = request.body;
//   note.id = maxId + 1;

//   notes = notes.concat(note);

//   response.json(note);
// });

app.post("/api/notes", (request, response) => {
  const body = request.body;

  // Commented out to defer validation to Mongoose
  // if (!body.content) {
  //   return response.status(400).json({ error: "content missing" });
  // }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => next(error)); // it passes any potential exceptions to the error handler middleware.
});

// app.delete("/api/notes/:id", (request, response) => {
//   const id = Number(request.params.id);
//   notes = notes.filter((note) => note.id !== id);
//   response.status(204).end();
// });
// ********* Update with Express method *********
app.delete("/api/notes/:id", (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// ********* Middleware for handling errors *********
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

// const PORT = process.env.PORT || 3001;
const PORT = process.env.PORT; // 3001 is defined in .env
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
