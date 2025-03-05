import React, { useEffect, useState } from 'react';
import KBackend from '../utils/constants';
import SearchBar from '../components/SearchBar';
import { Card } from "flowbite-react";
import { Link } from 'react-router-dom';

const Shop = () => {
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch(`${KBackend.url}/all-books`).then(res => res.json()).then(data => setBooks(data));
    }, []);

    const filteredBooks = books.filter(book =>
        book.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='mt-28 px-4 lg:px-24'>
            <h2 className='text-5xl font-bold text-center mb-8'>All Books are here</h2>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div className='grid gap-8 my-12 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1'>
                {filteredBooks.map(book => (
                    <Link to={`/book/${book._id}`} key={book._id}>
                        <Card
                            className="max-w-xxs flex flex-col h-full"
                            imgAlt="Meaningful alt text for an image that is not purely decorative"
                            imgSrc={book.imageUrl}
                        >
                            <div className="flex-grow h-48 overflow-hidden">
                                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {book.bookTitle}
                                </h5>
                                <p className="font-normal text-gray-700 dark:text-gray-400">
                                    {book.bookDescription}
                                </p>
                            </div>
                            <button className='bg-blue-700 font-semibold text-white py-2 rounded'>Buy Now</button>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Shop;

