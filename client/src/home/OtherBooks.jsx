import React, { useEffect, useState } from 'react'
import BookCards from '../components/BookCards';

const OtherBooks = () => {
  const [books, setBooks] = useState([]);

  useEffect( () => {
      fetch("http://localhost:5001/all-books").then(res => res.json()).then(data => setBooks(data.slice(1, 5)))
  }, [])

  return (
  <div>
    <BookCards books = {books} headline = "Other books" />
  </div>
)
}

export default OtherBooks
