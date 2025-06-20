import React from 'react'

function JobCategory() {
  return (
    <>
        <div className="w-[100%] h-[1250px] absolute top-0 left-0 z-30 flex justify-end items-center">
            <div className='w-[100%] h-[100%] bg-gray-500 absolute top-0 left-0  z-10 opacity-50'/>

            
            <div className= "flex  w-[350px] h-[100%] right-0 bg-white flex-grow shadow-lg absolute  z-20"
            >
                <div className='w-[100%] h-[100%] flex flex-col justify-between items-center p-4 '
                     
                     >

                    <div className='w-[100%]'>
                        <h1 className="text-2xl py-4 text-center font-semibold font-poppins border-b border-b-gray-300">Categories</h1>
                        <div className='w-[100%] h-[100%] overflow-y-auto'>
                            <ul className='flex flex-col gap-3 '>
                                <li type="checkbox" className='text-lg font-semibold border-b border-b-gray-300'>Software Development</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Data Science</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Design</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Marketing</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Sales</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Customer Support</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Finance</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Human Resources</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Project Management</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Content Creation</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Consulting</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Legal</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Education</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Healthcare</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Engineering</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Manufacturing</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Logistics</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Real Estate</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Retail</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Hospitality</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Non-Profit</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Government</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Telecommunications</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Energy</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Agriculture</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Construction</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Transportation</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Insurance</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Pharmaceuticals</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Information Technology</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Business Development</li>
                                <li className='text-lg font-semibold border-b border-b-gray-300'>Public Relations</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default JobCategory