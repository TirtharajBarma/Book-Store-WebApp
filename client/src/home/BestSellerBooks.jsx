import React, { useEffect, useState } from 'react'
import BookCards from '../components/BookCards';

const BestSellerBooks = () => {
    const [books, setBooks] = useState([]);

    useEffect( () => {
        fetch("http://localhost:5001/all-books").then(res => res.json()).then(data => setBooks(data.slice(0, 5)))
    }, [])
  return (
    <div>
      <BookCards books = {books} headline = "Best Seller books" />
    </div>
  )
}

export default BestSellerBooks;

// useSate -> React Hook
// React Hook -> functional components to manage state and side effects without writing a class
// state -> is used to manage data within a component. State variables hold information that may change over time and affect the rendering of the component. 
// state variable named books
// setBooks is the function you use to update books
