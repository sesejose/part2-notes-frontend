import Note from "./components/Note";
import { useState } from "react";
import axios from "axios";
import noteService from "./services/notes";
import { useEffect } from "react";
import Notification from "./components/Notifications";
import Footer from "./components/Footer";

const App = (props) => {
  const [notes, setNotes] = useState(props.notes);
  const [newNote, setNewNote] = useState();
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState("some error happened...");

  //ternary operator --> Condition is true, show all notes, if false, show only important notes. The state determinates if true or false!
  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  // Using the MODULE: Import all notes from the server using axios when the component mounts.
  useEffect(() => {
    noteService.getAll().then((response) => {
      setNotes(response.data);
    });
  }, []);

  // handleNoteChange updates the state of the newNote whenever the input field changes.
  // Then, addNote creates a new note object, adds it to the notes state, and sends it to the server using axios.
  const handleNoteChange = (e) => {
    console.log(e.target.value);
    setNewNote(e.target.value);
  };
  // update new note state on input change
  const addNote = (e) => {
    e.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: String(notes.length + 1),
      // String is a method that converts the number to a string as equal as toString()
    };
    // setNotes(notes.concat(noteObject));
    // setNewNote("");

    // Sending data to the server with axios
    // axios.post("http://localhost:3001/notes", noteObject).then((response) => {
    //   setNotes(notes.concat(response.data));
    //   setNewNote("");
    // });

    noteService.create(noteObject).then((response) => {
      setNotes(notes.concat(response.data));
      setNewNote("");
    });
  };

  // toggleImportance function is passed as a prop to handle the importance toggle action in Note component
  // This is, toogleImportance={() => toggleImportanceOf(note.id)} is used to create a new function for each note that calls toggleImportanceOf with the specific note's id and then passed down to Note component
  // every note receives its own unique event handler function since the id of every note is unique.

  const toggleImportanceOf = (id) => {
    // const url = `http://localhost:3001/notes/${id}`;
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };
    // console.log("Toggling importance of note with id:", id);
    // axios.put(url, changedNote).then((response) => {
    //   setNotes(notes.map((note) => (note.id === id ? response.data : note)));
    // });
    noteService
      .update(id, changedNote)
      .then((response) => {
        setNotes(notes.map((note) => (note.id === id ? response.data : note)));
      })
      // When the error occurs we add a descriptive error message to the errorMessage state.
      // At the same time, we start a timer, that will set the errorMessage state to null after five seconds
      .catch((error) => {
        setErrorMessage(`Note '${note.content}' was already removed from server`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
        // It keeps only notes whose n.id is different from id, so it effectively removes the note(s) whose id equals the id variable (parameter defined with the map).
      });
  };

  // Patch explanation:
  // const toggleImportanceOf = (id) => {
  //   const url = `http://localhost:3001/notes/${id}`;
  //   const note = notes.find((n) => n.id === id);
  //   const patch = { important: !note.important };
  //   console.log("Toggling importance of note with id:", id);
  //   axios.patch(url, patch).then((response) => {
  //     setNotes(notes.map((note) => (note.id === id ? response.data : note)));
  //   });
  // };
  // In the toggleImportanceOf function, instead of sending the entire changedNote object with a PUT request, we create a patch object that only includes the important field that needs to be updated.
  // Ater creating the patch object, we send it to the server using axios.patch() method.
  // the server responds with the updated note, which we then use to update the local state.
  // We then send this patch object using a PATCH request to the server. This approach is more efficient as it reduces the amount of data sent over the network, especially when only a small part of the resource needs to be updated.
  // The server processes the PATCH request and updates only the specified fields of the note resource.

  return (
    <div>
      <Notification message={errorMessage} />
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>show {showAll ? "important" : "all"}</button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">Add</button>
      </form>

      <Footer />
    </div>
  );
};

export default App;
