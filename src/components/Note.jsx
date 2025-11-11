// toggleImportance function is passed as a prop to handle the importance toggle action
const Note = ({ note, toggleImportance }) => {
  // The button label changes based on the current importance status of the note
  const label = note.important ? "make not important" : "make important";

  // Note component displays the content of a note and a button to toggle its importance
  return (
    <li className="note">
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  );
};

export default Note;
