import React from 'react'
import { useLoaderData, useParams } from 'react-router-dom'
import UploadBook from './UploadBook'

const EditBooks = () => {
  const { id } = useParams();
  const bookData = useLoaderData();


  return (
    <UploadBook 
      editMode={true} 
      bookData={bookData} 
      bookId={id} 
    />
  );
}

export default EditBooks
