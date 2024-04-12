import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import {FaStar, FaStarHalf} from "react-icons/fa6";
import { Avatar } from "flowbite-react";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import './styles.css';

// import required modules
import { Pagination } from 'swiper/modules';

const Review = () => {
  return (
    <div className='my-12 px-4 lg:px-24'>
      <h2 className='text-5xl font-bold text-center mb-10 leading-snug'>Our Customers </h2>

      <div>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}

        // only 3 per time
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 50,
          },
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        <SwiperSlide className='shadow-2xl bg-white py-8 px-5 md:m-5 rounded-lg border'>
            <div className='space-y-6'>
                <div className='text-amber-500 flex gap-2'>
                    <FaStar/>
                    <FaStar/>
                    <FaStar/>
                    <FaStar/>
                </div>

                {/* text */}
                <div className="mt-7">
                    <p className='mb-5'>A treasure trove for book lovers! 📚😍</p>

                        <Avatar img="https://i.pinimg.com/474x/8e/da/b4/8edab4672131cee07ff6bd4725902227.jpg" alt="avatar of Jese" rounded className='w-10 mb-4'
                        />
                        <h5 className='text-lg font-medium'>Polly Baldwin</h5>
                        <p className='text-base'>Paraguay</p>
                </div>
            </div>
        </SwiperSlide>

        <SwiperSlide className='shadow-2xl bg-white py-8 px-5 md:m-5 rounded-lg border'>
            <div className='space-y-6'>
                <div className='text-amber-500 flex gap-2'>
                    <FaStar/>
                    <FaStar/>
                    <FaStar/>
                    <FaStar/>
                    <FaStarHalf/>
                </div>

                {/* text */}
                <div className="mt-7">
                    <p className='mb-5'>Great selection, fast delivery! 📚🚀</p>

                        <Avatar img="https://i.pinimg.com/564x/2e/dd/02/2edd02160b51797f7adb807a79d96d36.jpg" alt="avatar of Jese" rounded className='w-10 mb-4'
                        />
                        <h5 className='text-lg font-medium'>Jay Sparks</h5>
                        <p className='text-base'>Cayman Islands</p>
                </div>
            </div>
        </SwiperSlide>

        <SwiperSlide className='shadow-2xl bg-white py-8 px-5 md:m-5 rounded-lg border'>
            <div className='space-y-6'>
                <div className='text-amber-500 flex gap-2'>
                    <FaStar/>
                    <FaStar/>
                    <FaStar/>
                    <FaStar/>
                </div>

                {/* text */}
                <div className="mt-7">
                    <p className='mb-5'>Love the cozy vibes! 📖❤️</p>

                        <Avatar img="https://i.pinimg.com/564x/01/c7/51/01c751482ef7c4f5e93f3539efd27f6f.jpg" alt="avatar of Jese" rounded className='w-10 mb-4'
                        />
                        <h5 className='text-lg font-medium'>Ethan Greene</h5>
                        <p className='text-base'>Armenia</p>
                </div>
            </div>
        </SwiperSlide>

        <SwiperSlide className='shadow-2xl bg-white py-8 px-5 md:m-5 rounded-lg border'>
            <div className='space-y-6'>
                <div className='text-amber-500 flex gap-2'>
                    <FaStar/>
                    <FaStar/>
                    <FaStar/>
                    <FaStar/>
                    <FaStar/>
                </div>

                {/* text */}
                <div className="mt-7">
                    <p className='mb-5'>Best bookstore ever! Knowledgeable staff. 📖</p>

                        <Avatar img="https://i.pinimg.com/564x/33/b2/95/33b295a1a4a1af86ce9d54f15d7d69bb.jpg" alt="avatar of Jese" rounded className='w-10 mb-4'
                        />
                        <h5 className='text-lg font-medium'>Ernest Cannon</h5>
                        <p className='text-base'>South Africa</p>
                </div>
            </div>
        </SwiperSlide>

        <SwiperSlide className='shadow-2xl bg-white py-8 px-5 md:m-5 rounded-lg border'>
            <div className='space-y-6'>
                <div className='text-amber-500 flex gap-2'>
                    <FaStar/>
                    <FaStar/>
                    <FaStar/>
                    <FaStarHalf/>
                </div>

                {/* text */}
                <div className="mt-7">
                    <p className='mb-5'>Awesome service, affordable prices! 📘💰.</p>

                        <Avatar img="https://i.pinimg.com/564x/38/a8/1a/38a81a67ac5bd448fa9a4bc7a15ff58c.jpg" alt="avatar of Jese" rounded className='w-10 mb-4'
                        />
                        <h5 className='text-lg font-medium'>Dominic Ingram</h5>
                        <p className='text-base'>French Guiana</p>
                </div>
            </div>
        </SwiperSlide>

        <SwiperSlide className='shadow-2xl bg-white py-8 px-5 md:m-5 rounded-lg border'>
            <div className='space-y-6'>
                <div className='text-amber-500 flex gap-2'>
                    <FaStar/>
                    <FaStar/>
                    <FaStar/>
                    <FaStar/>
                    <FaStarHalf/>
                </div>

                {/* text */}
                <div className="mt-7">
                    <p className='mb-5'>Incredible variety, my go-to for all book needs!</p>

                        <Avatar img="https://i.pinimg.com/474x/8e/74/91/8e7491bda80e37200caeae027112472a.jpg" alt="avatar of Jese" rounded className='w-10 mb-4'
                        />
                        <h5 className='text-lg font-medium'>Ann Daniel</h5>
                        <p className='text-base'>Isle of Man</p>
                </div>
            </div>
        </SwiperSlide>
        
      </Swiper>

      </div>
    </div>
  )
}

export default Review
