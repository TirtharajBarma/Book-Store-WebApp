import React from 'react';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className='mb-4'>
            <input
                type='text'
                placeholder='Search for books...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-lg'
            />
        </div>
    );
};

export default SearchBar;