import React, { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { ChevronDown, Share2, Star, StarHalf } from 'lucide-react';

const SingleBook = () => {
    const { _id, bookTitle, authorName, bookDescription, price, imageUrl, category } = useLoaderData();
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="max-w-6xl mx-auto p-6 font-sans mt-20">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Book Cover */}
                <div className="flex-shrink-0">
                    <img 
                        src={imageUrl} 
                        alt={bookTitle} 
                        className="w-64 h-auto rounded shadow"
                    />
                    <div className="mt-4">
                        <button className="w-full py-3 px-4 bg-green-700 text-white rounded flex items-center justify-between">
                            <span className="font-medium">Want to read</span>
                            <ChevronDown size={20} />
                        </button>
                    </div>
                    <div className="mt-4">
                        <button className="w-full py-3 px-4 border border-gray-300 rounded flex items-center justify-between">
                            <span className="font-medium">Shop this series</span>
                            <Share2 size={20} />
                        </button>
                    </div>
                    <div className="mt-6 flex justify-center">
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={24} className="text-gray-300" />
                            ))}
                        </div>
                    </div>
                    <div className="text-center mt-2 text-sm text-gray-700">
                        Rate this book
                    </div>
                </div>
                {/* Book Details */}
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h1 className="text-4xl font-bold">{bookTitle}</h1>
                        <Share2 size={24} className="text-gray-600" />
                    </div>
                    <h2 className="text-xl mt-2">{authorName}</h2>
                    <div className="flex items-center mt-3">
                        <div className="flex">
                            {[1, 2, 3, 4].map((star) => (
                                <Star key={star} fill="currentColor" className="text-orange-400" size={24} />
                            ))}
                            <StarHalf className="text-orange-400" size={24} />
                        </div>
                        <span className="ml-2 text-3xl font-bold">4.26</span>
                        <span className="ml-3 text-gray-600 text-sm">6,547,369 ratings · 124,698 reviews</span>
                    </div>
                    <p className="mt-4 text-gray-800">
                        {bookDescription}
                    </p>
                    
                    <div className="mt-6">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600">Genres</span>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{category}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 text-gray-700">
                        <p className="text-2xl font-semibold mb-4">Price: <span className="px-4 py-2 rounded-lg">₹{price}</span></p>
                    </div>
                    {/* <div className="mt-6 border-b pb-6">
                        <button className="flex items-center text-gray-700 font-medium">
                            Book details & editions 
                        </button>
                    </div> */}
                    
                    {/* <div className="mt-6 flex items-center justify-between flex-wrap">
                        <div className="flex items-center">
                            <div className="flex -space-x-2">
                                <img src="/api/placeholder/32/32" alt="Reader" className="w-8 h-8 rounded-full border-2 border-white" />
                                <img src="/api/placeholder/32/32" alt="Reader" className="w-8 h-8 rounded-full border-2 border-white" />
                                <img src="/api/placeholder/32/32" alt="Reader" className="w-8 h-8 rounded-full border-2 border-white" />
                            </div>
                            <span className="ml-2 text-gray-700">92.8k people are currently reading</span>
                        </div>
                        <div className="flex items-center">
                            <div className="flex -space-x-2">
                                <img src="/api/placeholder/32/32" alt="Reader" className="w-8 h-8 rounded-full border-2 border-white" />
                                <img src="/api/placeholder/32/32" alt="Reader" className="w-8 h-8 rounded-full border-2 border-white" />
                                <img src="/api/placeholder/32/32" alt="Reader" className="w-8 h-8 rounded-full border-2 border-white" />
                            </div>
                            <span className="ml-2 text-gray-700">3m people want to read</span>
                        </div>
                    </div> */}
                    <div className="mt-20">
                        <h3 className="text-2xl font-bold">About the author</h3>
                        <div className="mt-4 flex items-center justify-between flex-wrap">
                            <div className="flex items-center">
                                <img 
                                    src="/api/placeholder/60/60" 
                                    alt="Harper Lee" 
                                    className="w-12 h-12 rounded-full"
                                />
                                <h4 className="ml-4 text-xl">{authorName}</h4>
                            </div>
                            <button 
                                className={`py-2 px-6 rounded-full ${isFollowing ? 'bg-gray-200' : 'bg-black text-white'}`}
                                onClick={() => setIsFollowing(!isFollowing)}
                            >
                                {isFollowing ? 'Following' : 'Follow'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleBook;


