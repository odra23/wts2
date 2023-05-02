import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import "firebase/database";
import 'bootstrap/dist/css/bootstrap.min.css';

const firebaseConfig = {
  apiKey: "AIzaSyBW64FxkBny6d2KrEDNeezFd6YAcyy60iE",
  authDomain: "book-list-f39c8.firebaseapp.com",
  projectId: "book-list-f39c8",
  storageBucket: "book-list-f39c8.appspot.com",
  messagingSenderId: "969424353098",
  appId: "1:969424353098:web:bb210984ca4c14b50af3b3"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [editing, setEditing] = useState(false);
  const [editBookId, setEditBookId] = useState(null);

  useEffect(() => {
    db.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setBooks(Object.values(data));
      }
    });
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    const id = uuidv4();
    const newBook = { id, title, author, year };
    db.child(id).set(newBook);
    setTitle('');
    setAuthor('');
    setYear('');
  };

  const handleEdit = (id) => {
    setEditing(true);
    setEditBookId(id);
    const index = books.findIndex((book) => book.id === id);
    const book = books[index];
    setTitle(book.title);
    setAuthor(book.author);
    setYear(book.year);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedBook = { id: editBookId, title, author, year };
    db.child(editBookId).set(updatedBook);
    setTitle('');
    setAuthor('');
    setYear('');
    setEditing(false);
    setEditBookId(null);
  };

  const handleCancelEdit = () => {
    setTitle('');
    setAuthor('');
    setYear('');
    setEditing(false);
    setEditBookId(null);
  };

  const handleDelete = (id) => {
    db.child(id).remove();
    setBooks(books.filter((book) => book.id !== id));
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4 h3">Book List</h1>
      {editing ? (
        <form onSubmit={handleUpdate} className="row g-3">
          <div className="col-md-4">
            <label htmlFor="title" className="form-label">Title</label>
            <input type="text" className="form-control" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="col-md-4">
            <label htmlFor="author" className="form-label">Author</label>
            <input type="text" className="form-control" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
          </div>
          <div className="col-md-2">
            <label htmlFor="year" className="form-label">Year</label>
            <input type="number" className="form-control" id="year" value={year} onChange={(e) => setYear(e.target.value)} required />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button type="submit" className="btn btn-primary me-2">Update</button>
            <button type="button" className="btn btn-danger" onClick={handleCancelEdit}>Cancel</button>
          </div>
          </form>
          ) : (
          <form onSubmit={handleAdd} className="row g-3">
          <div className="col-md-4">
            <label htmlFor="title" className="form-label">Title</label>
            <input type="text" className="form-control" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="col-md-4">
            <label htmlFor="author" className="form-label">Author</label>
            <input type="text" className="form-control" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
          </div>
          <div className="col-md-2">
            <label htmlFor="year" className="form-label">Year</label>
            <input type="number" className="form-control" id="year" value={year} onChange={(e) => setYear(e.target.value)} required />
          </div>
          <div className="col-md d-flex align-items-end">
            <button type="submit" className="btn btn-primary me-2">Add</button>
          </div>
          </form>
          )}
          <br></br>
          <hr />
          <div style={{maxHeight: '380px', overflowY: 'auto'}}>
          <table className="table table-striped table-hover table-bordered">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.year}</td>
                  <td>
                    <button className="btn btn-primary me-2" onClick={() => handleEdit(book.id)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(book.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

  );
  }

export default App;