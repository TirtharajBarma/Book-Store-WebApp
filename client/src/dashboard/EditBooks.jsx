import React, { useState } from 'react'
import { useLoaderData, useParams } from 'react-router-dom'
import { Button, Checkbox, Label, Select, TextInput , Textarea} from "flowbite-react"


const EditBooks = () => {
  const {id} = useParams();
  const {bookTitle, authorName, imageUrl, category, bookDescription, bookPdfUrl, price} = useLoaderData()


  const bookCategories = [
    "Friction",
    "Non-Friction",
    "Mystery",
    "Programming",
    "Science Friction",
    "Fantasy",
    "Horror",
    "History",
    "Romance",
    "Romantasy"
  ]

  const [selectedBookCategory, setSelectedBookCategory] = useState(bookCategories[0]);

  const handleChangeSelectedValue = (event) => {
    console.log(event.target.value);
    setSelectedBookCategory(event.target.value);
  }

  //handel book submission
  //collecting data on form submit
  const handleUpdate = (event) => {
    event.preventDefault();
    const form = event.target;

    const bookTitle = form.bookTitle.value;
    const authorName = form.authorName.value;
    const imageUrl = form.imageUrl.value;
    const category = form.categoryName.value;
    const bookDescription = form.bookDescription.value;
    const bookPdfUrl = form.bookPdfUrl.value;
    const price = form.price.value;


    const UpdateBookObj = {
      bookTitle, authorName, imageUrl, category, bookDescription, bookPdfUrl, price
    }

    // console.log(bookObj);

    //send data to DataBase
    fetch(`http://localhost:5001/book/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(UpdateBookObj)

    }).then(res => res.json()).then(data => {
      alert("Book updated successfully!!");
    })
  }

  return (
    <div className='px-4 my-12'>
      <h2 className='mb-8 text-3xl font-bold'>Update the Book data</h2>

      {/* redirecting to the function created */}
      <form onSubmit={handleUpdate} className="flex lg:w-[1180px] flex-col flex-wrap gap-4">
      
      {/* first row */}
      <div className='flex gap-8'>

        {/* book title */}
        <div className='lg:w-1/2'>
          <div className="mb-2 block">
            <Label htmlFor="bookTitle" value="Book Title" />
          </div>

          {/* default value fetch the bookTitle */}
          <TextInput id="bookTitle" name = "bookTitle" type="text" placeholder="Book name" defaultValue={bookTitle} required />
        </div>
        

        {/* author name */}
        <div className='lg:w-1/2'>
          <div className="mb-2 block">
            <Label htmlFor="authorName" value="Author Name" />
          </div>
          <TextInput id="authorName" name = "authorName" type="text" placeholder="Author Name" defaultValue={authorName} required />
        </div>
      </div>

      {/* second row */}
      <div className='flex gap-8'>

        {/* book title */}
        <div className='lg:w-1/2'>
          <div className="mb-2 block">
            <Label htmlFor="imageUrl" value="Book Image URL" />
          </div>
          <TextInput id="imageUrl" name = "imageUrl" type="text" placeholder="Book Image Url" defaultValue={imageUrl} required />
        </div>
        

        {/* category name */}
        <div className='lg:w-1/2'>
          <div className="mb-2 block">
            <Label htmlFor="inputState" value="Book Category" />
          </div>

          <Select id='inputState' name='categoryName' className='w-full rounded' value={selectedBookCategory} onChange={handleChangeSelectedValue}>
            {
              bookCategories.map( (option) => <option key={option} value={option}>{option}</option>)
            }
          </Select>
        </div>
      </div>


      <div className='flex gap-8'>
      {/* price */}
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="price" value="Price" />
            </div>
            <TextInput id="price" name = "price" type="number" placeholder="Price" required defaultValue={price} />
          </div>

          {/* book pdf link */}
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="bookPdfUrl" value="Book PDF URL" />
            </div>
            <TextInput id="bookPdfUrl" name = "bookPdfUrl" type="text" placeholder="Book Pdf Url" defaultValue={bookPdfUrl} required />
          </div>

      </div>

      {/* bookDescription */}
      <div>
        <div className="mb-2 block">
          <Label htmlFor="bookDescription" value="Book Description" />
        </div>
        <Textarea id="bookDescription" name="bookDescription" placeholder="write your book description..." required rows={4} className='w-full' defaultValue={bookDescription}/>
      </div>


      <Button type="submit" className='mt-5'>Update Book</Button>

    </form>
    </div>
  )
}

export default EditBooks
