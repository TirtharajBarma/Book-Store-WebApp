import React, { useState } from 'react'
import { Button, Checkbox, Label, Select, TextInput , Textarea, Alert} from "flowbite-react"
import { Upload, FileText, Image as ImageIcon, Link2, BookOpen, CheckCircle } from 'lucide-react'
import KBackend from '../utils/constants';
import { convertToDirectPdfUrl, extractGoogleDriveFileId } from '../utils/pdfUtils';
import PdfUrlHelper from '../components/PdfUrlHelper';

const UploadBook = () => {

  const bookCategories = [
    "Fiction",
    "Non-Fiction",
    "Mystery",
    "Programming",
    "Science Fiction",
    "Fantasy",
    "Horror",
    "History",
    "Romance",
    "Romantasy"
  ]

  const [selectedBookCategory, setSelectedBookCategory] = useState(bookCategories[0]);
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'file'
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [alertInfo, setAlertInfo] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [convertedUrl, setConvertedUrl] = useState('');

  const handleChangeSelectedValue = (event) => {
    console.log(event.target.value);
    setSelectedBookCategory(event.target.value);
  }

  // Handle PDF URL change and auto-convert
  const handlePdfUrlChange = (e) => {
    const url = e.target.value;
    setPdfUrl(url);
    
    if (url) {
      const converted = convertToDirectPdfUrl(url);
      setConvertedUrl(converted);
    } else {
      setConvertedUrl('');
    }
  }

  //handel book submission
  //collecting data on form submit
  const handelBookSubmit = async (event) => {
    event.preventDefault();
    setIsUploading(true);
    setAlertInfo(null);
    
    const form = event.target;

    const bookTitle = form.bookTitle.value;
    const authorName = form.authorName.value;
    const imageUrl = form.imageUrl.value;
    const category = form.categoryName.value;
    const bookDescription = form.bookDescription.value;
    const bookPdfUrl = convertedUrl || form.bookPdfUrl.value; // Use converted URL
    const price = form.price.value;

    const bookObj = {
      bookTitle, authorName, imageUrl, category, bookDescription, bookPdfUrl, price
    }

    console.log(bookObj);

    try {
      //send data to DataBase
      const response = await fetch(`${KBackend.url}/upload-book`, {
        method: "POST",
        headers: {
          "Content-type" : "application/json",
        },
        body: JSON.stringify(bookObj),
      });

      const data = await response.json();
      
      if (response.ok) {
        setAlertInfo({ type: 'success', message: '✅ Book uploaded successfully!' });
        form.reset();
        setPdfUrl('');
        setConvertedUrl('');
        setTimeout(() => setAlertInfo(null), 5000);
      } else {
        setAlertInfo({ type: 'failure', message: '❌ Failed to upload book. Please try again.' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setAlertInfo({ type: 'failure', message: '❌ Network error. Please check your connection.' });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className='px-4 my-12'>
      <div className="mb-8">
        <h2 className='text-3xl font-bold flex items-center gap-3'>
          <BookOpen className="text-blue-600" size={32} />
          Upload a Book
        </h2>
        <p className="text-gray-600 mt-2">Add a new book to your collection with all the details</p>
      </div>

      {/* Alert Messages */}
      {alertInfo && (
        <Alert color={alertInfo.type} className="mb-6" onDismiss={() => setAlertInfo(null)}>
          <span className="font-medium">{alertInfo.message}</span>
        </Alert>
      )}

      {/* redirecting to the function created */}
      <form onSubmit={handelBookSubmit} className="flex lg:w-[1180px] flex-col flex-wrap gap-6">
      
      {/* Book Information Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <FileText size={24} className="text-blue-600" />
          Book Information
        </h3>
        
        {/* first row */}
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* book title */}
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="bookTitle" value="Book Title *" className="font-semibold" />
            </div>
            <TextInput 
              id="bookTitle" 
              name="bookTitle" 
              type="text" 
              placeholder="e.g., The Great Gatsby" 
              required 
              icon={FileText}
            />
          </div>
          
          {/* author name */}
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="authorName" value="Author Name *" className="font-semibold" />
            </div>
            <TextInput 
              id="authorName" 
              name="authorName" 
              type="text" 
              placeholder="e.g., F. Scott Fitzgerald" 
              required 
            />
          </div>
        </div>
      </div>

      {/* Media & Details Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <ImageIcon size={24} className="text-purple-600" />
          Media & Details
        </h3>
        
        {/* second row */}
        <div className='flex flex-col lg:flex-row gap-6 mb-6'>
          {/* book image url */}
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="imageUrl" value="Book Cover Image URL *" className="font-semibold" />
              <p className="text-xs text-gray-500 mt-1">Use a direct image link (JPG, PNG)</p>
            </div>
            <TextInput 
              id="imageUrl" 
              name="imageUrl" 
              type="url" 
              placeholder="https://example.com/book-cover.jpg" 
              required 
              icon={ImageIcon}
            />
          </div>
          
          {/* category name */}
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="inputState" value="Book Category *" className="font-semibold" />
            </div>
            <Select 
              id='inputState' 
              name='categoryName' 
              className='w-full rounded' 
              value={selectedBookCategory} 
              onChange={handleChangeSelectedValue}
            >
              {bookCategories.map((option) => <option key={option} value={option}>{option}</option>)}
            </Select>
          </div>
        </div>

        <div className='flex flex-col lg:flex-row gap-6'>
          {/* price */}
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="price" value="Price (₹) *" className="font-semibold" />
            </div>
            <TextInput 
              id="price" 
              name="price" 
              type="number" 
              placeholder="299" 
              required 
              min="0"
            />
          </div>

          {/* book pdf link */}
          <div className='lg:w-1/2'>
            <div className="mb-2 block">
              <Label htmlFor="bookPdfUrl" value="Book PDF URL *" className="font-semibold" />
              <p className="text-xs text-gray-500 mt-1">
                Paste any Google Drive/Dropbox link - we'll convert it! 
                <span className="ml-2"><PdfUrlHelper /></span>
              </p>
            </div>
            <TextInput 
              id="bookPdfUrl" 
              name="bookPdfUrl" 
              type="url" 
              placeholder="https://drive.google.com/file/d/..." 
              required 
              icon={Link2}
              value={pdfUrl}
              onChange={handlePdfUrlChange}
            />
            {convertedUrl && convertedUrl !== pdfUrl && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-800 mb-1">✅ Auto-converted to direct link:</p>
                    <p className="text-green-700 break-all">{convertedUrl}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Book Description</h3>
        <div className="mb-2 block">
          <Label htmlFor="bookDescription" value="Description *" className="font-semibold" />
          <p className="text-xs text-gray-500 mt-1">Provide a compelling summary of the book</p>
        </div>
        <Textarea 
          id="bookDescription" 
          name="bookDescription" 
          placeholder="Enter a detailed description of the book, including plot summary, themes, and what makes it special..." 
          required 
          rows={6} 
          className='w-full'
        />
      </div>

      {/* Upload Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">📌 Tips for Best Results:</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Use high-quality book cover images (recommended: 400x600px)</li>
          <li>PDF files should be publicly accessible and CORS-enabled</li>
          <li>For free PDF hosting, try: Google Drive, Dropbox, or GitHub</li>
          <li>Write engaging descriptions to attract readers</li>
          <li>Double-check all URLs before submitting</li>
        </ul>
      </div>

      <Button 
        type="submit" 
        className='mt-5 w-full lg:w-auto' 
        size="lg"
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <Upload className="mr-2 h-5 w-5 animate-pulse" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-5 w-5" />
            Upload Book
          </>
        )}
      </Button>

    </form>
    </div>
  )
}

export default UploadBook
