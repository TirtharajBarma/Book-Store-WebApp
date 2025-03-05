import React from 'react'
import BannerCard from './BannerCard'

const Banner = () => {
  return (
    // background teal color
    <div className='px-4 lg:px-24 bg-teal-100 flex items-center'>
        <div className='flex w-full flex-col md:flex-row justify-between items-center gap-12 py-40'>
            {/* left side */}
            {/* space-y-8 space between lorem and search */}
            <div className='md:w-1/2 space-y-8 h-full'>

                <h2 className='text-5xl font-bold leading-snug text-black'>Buy and Sell Your Books <span className='text-blue-700'>for the best Best prices</span></h2>
                
                <p className='md:w-4/5'>Embark on a literary journey where every page holds a world of wonder. Our bookstore is a sanctuary for bibliophiles, a realm where stories dance off the shelves and imagination knows no bounds. Welcome to a haven where every book finds its perfect reader.</p>
                
                {/* <div>
                    <input type="search" name='search' id='search' placeholder='Search a book' className='py-2 px-2 rounded-sm outline-none'/>
                    <button className='bg-blue-700 px-6 py-2 text-white font-medium hover:bg-black transition-all ease-in duration-250'>Search</button>
                </div> */}
                
            </div>

            {/* importing BannerCard
            <div>
                <BannerCard/>
            </div> */}

            <div>
                {/* referring to the bannerCard.jsx */}
                <BannerCard></BannerCard>
            </div>
        </div>
    </div>
  )
}

export default Banner
