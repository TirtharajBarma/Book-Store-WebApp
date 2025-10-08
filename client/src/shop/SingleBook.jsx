import React, { useState, useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { ChevronDown, Share2, Star, BookOpen, Check } from 'lucide-react';
import KBackend from '../utils/constants';

const SingleBook = () => {
    const book = useLoaderData();
    const { _id, bookTitle, authorName, bookDescription, price, imageUrl, category, bookPdfUrl } = book;
    const navigate = useNavigate();
    const [isFollowing, setIsFollowing] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [averageRating, setAverageRating] = useState(book.rating || 0);
    const [totalRatings, setTotalRatings] = useState(book.totalRatings || 0);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [shareSuccess, setShareSuccess] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Handle rating
    const handleRating = async (rating) => {
        setUserRating(rating);
        
        try {
            const response = await fetch(`${KBackend.url}/book/${_id}/rate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating }),
            });

            if (response.ok) {
                const data = await response.json();
                setAverageRating(data.averageRating);
                setTotalRatings(data.totalRatings);
            }
        } catch (error) {
            console.error('Error rating book:', error);
        }
    };

    // Handle share
    const handleShare = async () => {
        const shareData = {
            title: bookTitle,
            text: `Check out "${bookTitle}" by ${authorName}`,
            url: window.location.href,
        };

        // Check if Web Share API is available (mobile devices)
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error sharing:', error);
                }
            }
        } else {
            // Fallback for desktop - show share menu
            setShowShareMenu(!showShareMenu);
        }
    };

    // Copy link to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        setShareSuccess(true);
        setTimeout(() => {
            setShareSuccess(false);
            setShowShareMenu(false);
        }, 2000);
    };

    // Share to social media
    const shareToSocial = (platform) => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`Check out "${bookTitle}" by ${authorName}`);
        
        const urls = {
            twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            whatsapp: `https://wa.me/?text=${text}%20${url}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        };

        window.open(urls[platform], '_blank', 'width=600,height=400');
        setShowShareMenu(false);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 font-sans mt-20">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Book Cover */}
                <div className="flex-shrink-0 w-full md:w-auto flex flex-col items-center md:items-start">
                    <img 
                        src={imageUrl} 
                        alt={bookTitle} 
                        className="w-64 h-auto rounded shadow mx-auto md:mx-0"
                    />
                    {bookPdfUrl && (
                        <div className="mt-4">
                            <button 
                                onClick={() => navigate(`/book/${_id}/read`)}
                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center gap-2 transition-colors font-medium shadow-md"
                            >
                                <BookOpen size={20} />
                                <span>Read Now</span>
                            </button>
                        </div>
                    )}
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
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => handleRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star 
                                        size={28} 
                                        className={`${
                                            star <= (hoverRating || userRating) 
                                                ? 'text-yellow-400 fill-yellow-400' 
                                                : 'text-gray-300'
                                        } transition-colors`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="text-center mt-2 text-sm text-gray-700">
                        {userRating > 0 ? `You rated: ${userRating} stars` : 'Rate this book'}
                    </div>
                    {totalRatings > 0 && (
                        <div className="text-center mt-1 text-xs text-gray-500">
                            Average: {averageRating.toFixed(1)} ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
                        </div>
                    )}
                </div>
                {/* Book Details */}
                <div className="flex-1">
                    <div className="flex justify-between items-start gap-4">
                        <h1 className="text-3xl md:text-4xl font-bold">{bookTitle}</h1>
                        <div className="relative">
                            <button 
                                onClick={handleShare}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title="Share this book"
                            >
                                <Share2 size={24} className="text-gray-600" />
                            </button>
                            
                            {/* Share Menu (Desktop) */}
                            {showShareMenu && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
                                    <h3 className="font-semibold mb-3 text-gray-800">Share this book</h3>
                                    
                                    <button
                                        onClick={copyToClipboard}
                                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors mb-2"
                                    >
                                        {shareSuccess ? (
                                            <>
                                                <Check size={20} className="text-green-500" />
                                                <span className="text-green-600 font-medium">Link copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                                                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
                                                </svg>
                                                <span>Copy Link</span>
                                            </>
                                        )}
                                    </button>

                                    <div className="border-t pt-2 mt-2 space-y-2">
                                        <button
                                            onClick={() => shareToSocial('whatsapp')}
                                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-green-50 rounded-lg transition-colors text-green-600"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                            </svg>
                                            <span>WhatsApp</span>
                                        </button>

                                        <button
                                            onClick={() => shareToSocial('facebook')}
                                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                            </svg>
                                            <span>Facebook</span>
                                        </button>

                                        <button
                                            onClick={() => shareToSocial('twitter')}
                                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-sky-50 rounded-lg transition-colors text-sky-500"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                            </svg>
                                            <span>Twitter</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <h2 className="text-xl mt-2">{authorName}</h2>
                    {totalRatings > 0 && (
                        <div className="flex items-center mt-3">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                        key={star} 
                                        fill={star <= Math.round(averageRating) ? "currentColor" : "none"}
                                        className={star <= Math.round(averageRating) ? "text-orange-400" : "text-gray-300"} 
                                        size={24} 
                                    />
                                ))}
                            </div>
                            <span className="ml-2 text-3xl font-bold">{averageRating.toFixed(1)}</span>
                            <span className="ml-3 text-gray-600 text-sm">
                                {totalRatings.toLocaleString()} {totalRatings === 1 ? 'rating' : 'ratings'}
                            </span>
                        </div>
                    )}
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


