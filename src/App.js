import React, { useState } from "react";
import { useEffect } from "react";

const getStoredItem = (item) => {
  const storedItem = localStorage.getItem(item);
  if (storedItem) {
    return JSON.parse(localStorage.getItem(item));
  } else {
    return [];
  }
};

function App() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [notes, setNotes] = useState(getStoredItem("notes"));

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = () => {
    if (title.trim() === "") return;
    if (body.trim() === "") return;

    const date = new Date();
    const today = `${date.toDateString()} at ${date.toLocaleTimeString([], {
      hour12: true,
    })}`;

    const newNote = {
      id: today,
      title: title,
      text: body,
      isFavorite: false,
    };
    notes.unshift(newNote);
    setNotes([...notes]);
    setBody("");
    setTitle("");
  };

  const handleKeys = (e) => {
    if (title.trim() === "") return;
    if (body.trim() === "") return;
    if (e.ctrlKey && e.key === "Enter") {
      const date = new Date();
      const today = `${date.toDateString()} at ${date.toLocaleTimeString([], {
        hour12: true,
      })}`;
      const newNote = {
        id: today,
        title: title,
        text: body,
        isFavorite: false,
      };
      notes.unshift(newNote);
      setNotes([...notes]);
      setBody("");
      setTitle("");
    }
  };

  const toggleFavorite = (noteId) => {
    const updatedNotes = notes.map((note) => {
      if (note.id === noteId) {
        return {
          ...note,
          isFavorite: !note.isFavorite,
        };
      }
      return note;
    });

    setNotes(updatedNotes);
  };

  const handleDelete = (index) => {
    const updatedNotes = notes.map((note) => {
      if (note.id === index) {
        return {
          ...note,
          deleted: true,
        };
      }
      return note;
    });

    setNotes(updatedNotes);

    setTimeout(() => {
      const filteredNotes = updatedNotes.filter((note) => !note.deleted);
      setNotes(filteredNotes);
    }, 250);
  };
  

  const handleEdit = (index) => {
    const inputVal = document.querySelector("input");
    const textareaVal = document.querySelector("textarea");

    if (title !== "" && body !== "") {
      return alert("You have unsaved changes in your textarea");

      
    }

    const newNotes = [...notes];
    const filteredNote = newNotes.filter((note) => note.id === index);

    for (let item in filteredNote) {
      inputVal.value = filteredNote[item].title;
      textareaVal.value = filteredNote[item].text;

      setBody(filteredNote[item].text);
      setTitle(filteredNote[item].title);
    }
    handleDelete(index);
  };

  const formatNoteText = (text) => {
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="app">
      <h1>Notes</h1>
      <section className="create-box">
        <div className="user-box">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            onKeyUp={handleKeys}
            autoFocus={true}
            required
          />
          <label>note title</label>
        </div>
        <div className="user-box">
          <textarea
            name="text"
            id="text"
            cols="30"
            rows="5"
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
            }}
            onKeyUp={handleKeys}
            required
          ></textarea>
          <label>note body</label>
        </div>
        <div className="add">
          <code className="add-tag">ctrl+Enter to add</code>
          <button onClick={handleAddNote} className="btn">
            add note
          </button>
        </div>
      </section>

      <section className="display">
        <ul>
          {notes.map((note) => (
            <li key={note.id} className={`note-body ${note.deleted ? 'fade-out' : ''}`}
            data-id={note.id}>
              <h2 className="title">{note.title}</h2>
              <div className="like">
              <i
                className={`material-icons ${
                  note.isFavorite ? "favorite" : "favorite_border"
                }`}
                onClick={() => toggleFavorite(note.id)}
              >
                {note.isFavorite ? "favorite" : "favorite_border"}
              </i>
              <code>{note.isFavorite ? "" : "like"}</code>
              </div>
              <div className="note-text">{formatNoteText(note.text)}</div>
              <div className="control">
                <code>{note.id}</code>
                <div className="control-btn">
                  <i
                    onClick={() => {
                      handleEdit(note.id);
                    }}
                    className="material-icons"
                  >
                    edit
                  </i>
                  <i
                    onClick={() => handleDelete(note.id)}
                    className="material-icons"
                  >
                    delete
                  </i>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
