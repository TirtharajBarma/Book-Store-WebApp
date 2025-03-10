import React, { useEffect, useState } from 'react'
import { Table } from "flowbite-react";
import { Link } from 'react-router-dom';
import KBackend from '../utils/constants';

const ManageBooks = () => {
  const [allBooks, setAllBooks] = useState([]);
  useEffect( () => {
    fetch(`${KBackend.url}/all-books`).then(res => res.json()).then(data => setAllBooks(data));
  }, [])

  // delete a book
  const handleDelete = (id) => {
    console.log (id);
    fetch(`${KBackend.url}/book/${id}`, {
      method: "DELETE",
    }).then(res => res.json()).then(data => {
      alert("Book is deleted successfully!") 
      // setAllBooks(data);
      window.location.reload();
      // for reload
    })
  }

  return (
    <div className='px-4 my-12'>
      <h2 className='mb-8 text-3xl font-bold'>Manage Books</h2>

      {/* table for book data */}
      <Table className='lg:w-[1180px]'>
        <Table.Head>
          <Table.HeadCell>Number</Table.HeadCell>
          <Table.HeadCell>Book Name</Table.HeadCell>
          <Table.HeadCell>Author Name</Table.HeadCell>
          <Table.HeadCell>Category</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell>Edit or Manage</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit or Manage</span>
          </Table.HeadCell>
        </Table.Head>
        {
          // The allBooks.map() function is used to iterate over each item in the allBooks array
          allBooks.map((book, index) => <Table.Body className='divide-y' key={book._id}>
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {index + 1}
              {/* automatic numbering */}
              {/* index + 1 */}
            </Table.Cell>
            <Table.Cell>{book.bookTitle}</Table.Cell>
            <Table.Cell>{book.authorName}</Table.Cell>
            <Table.Cell>{book.category}</Table.Cell>
            <Table.Cell>{book.price}</Table.Cell>
            <Table.Cell>
              <Link className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 mr-5" to={`/admin/dashboard/edit-books/${book._id}`}>
                Edit
              </Link>
              <button onClick={ () => handleDelete(book._id)} className='bg-red-600 px-4 py-1 font-semibold text-white rounded-sm hover:bg-sky-600'>Delete</button>
            </Table.Cell>
          </Table.Row>
          </Table.Body>)
        }
      
      </Table>

    </div>
  )
}

export default ManageBooks
