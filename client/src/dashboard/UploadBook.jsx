import React, { useState } from 'react'
import { Button, Checkbox, Label, Select, TextInput , Textarea} from "flowbite-react"
import KBackend from '../utils/constants';

const UploadBook = () => {

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
  const handelBookSubmit = (event) => {
    event.preventDefault();
    const form = event.target;

    const bookTitle = form.bookTitle.value;
    const authorName = form.authorName.value;
    const imageUrl = form.imageUrl.value;
    const category = form.categoryName.value;
    const bookDescription = form.bookDescription.value;
    const bookPdfUrl = form.bookPdfUrl.value;
    const price = form.price.value;


    const bookObj = {
      bookTitle, authorName, imageUrl, category, bookDescription, bookPdfUrl, price
    }

    console.log(bookObj);

    //send data to DataBase
    fetch(`${KBackend.url}/upload-book`, {
      method: "POST",
      headers: {
        "Content-type" : "application/json",
      },

      body: JSON.stringify(bookObj),
      // JavaScript object into a JSON string,

    }).then(res => res.json()).then(data => {
      alert("Book uploaded successfully!!");
      form.reset();   //reset form after submission
    })
  }

  return (
    <div className='px-4 my-12'>
      <h2 className='mb-8 text-3xl font-bold'>Upload a Book</h2>

      {/* redirecting to the function created */}
      <form onSubmit={handelBookSubmit} className="flex lg:w-[1180px] flex-col flex-wrap gap-4">
      
      {/* first row */}
      <div className='flex gap-8'>

        {/* book title */}
        <div className='lg:w-1/2'>
          <div className="mb-2 block">
            <Label htmlFor="bookTitle" value="Book Title" />
          </div>
          <TextInput id="bookTitle" name = "bookTitle" type="text" placeholder="Book name" required />
        </div>
        

        {/* author name */}
        <div className='lg:w-1/2'>
          <div className="mb-2 block">
            <Label htmlFor="authorName" value="Author Name" />
          </div>
          <TextInput id="authorName" name = "authorName" type="text" placeholder="Author Name" required />
        </div>
      </div>

      {/* second row */}
      <div className='flex gap-8'>

        {/* book title */}
        <div className='lg:w-1/2'>
          <div className="mb-2 block">
            <Label htmlFor="imageUrl" value="Book Image URL" />
          </div>
          <TextInput id="imageUrl" name = "imageUrl" type="text" placeholder="Book Image Url" required />
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
      {/* book pdf link */}
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="price" value="Price" />
            </div>
            <TextInput id="price" name = "price" type="number" placeholder="Price" required />
          </div>

          {/* book pdf link */}
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="bookPdfUrl" value="Book PDF URL" />
            </div>
            <TextInput id="bookPdfUrl" name = "bookPdfUrl" type="text" placeholder="Book Pdf Url" required />
          </div>

      </div>

      {/* bookDescription */}
      <div>
        <div className="mb-2 block">
          <Label htmlFor="bookDescription" value="Book Description" />
        </div>
        <Textarea id="bookDescription" name="bookDescription" placeholder="write your book description..." required rows={4} className='w-full'/>
      </div>


      <Button type="submit" className='mt-5'>Upload Book</Button>

    </form>
    </div>
  )
}

export default UploadBook
