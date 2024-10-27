import React, { useEffect, useState } from 'react'
import BookCards from '../components/BookCards';
import KBackend from '../utils/constants';

const OtherBooks = () => {
  const [books, setBooks] = useState([]);

  useEffect( () => {
      fetch(`${KBackend.url}/all-books`).then(res => res.json()).then(data => setBooks(data.slice(5, 50)))
  }, [])

  return (
  <div>
    <BookCards books = {books} headline = "Other books" />
  </div>
)
}

export default OtherBooks
