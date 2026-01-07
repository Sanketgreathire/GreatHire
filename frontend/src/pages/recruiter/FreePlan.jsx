import React from 'react'
import { FaCheck } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { Helmet } from 'react-helmet-async';


function FreePlan() {
    return (
        <>
            <Helmet>
                {/* Meta Title */}
                <title>
                    Free Hiring Plan | Post Positions & Get Candidates for Free - GreatHire
                </title>

                {/* Meta Description */}
                <meta
                    name="description"
                    content="Unfold the GreatHire Free Plan, crafted specifically for startups as well as recruiters who are looking to hire smarter. The Hyderabad State India-based platform provides 15 free job listings with 150 candidate profiles per recruitment, thereby allowing you to assess candidates effectively. GreatHire enables entrepreneurs, recruiters, and HR professionals in a proliferating business environment with the help of efficient recruitment solutions. Start your recruitment experience with arisk-free plan designed specifically to provide utmost value."
                />
            </Helmet>

            <section className='h-[100vh] flex justify-center items-center font-[Oswald]'>
                <div className='bg-gray-200 w-[35%] h-[250px]  flex flex-col rounded-lg shadow-xl border border-gray-50 items-center justify-center'>
                    <div className='bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700 w-[100%] h-[45%] flex flex-col gap-1 justify-center rounded-t-lg  items-center text-white text-4xl font-semibold '>
                        <p className='text-green-500 bg-white rounded-full p-1 border-2 border-green-500'><FaCheckCircle /></p>
                        <h4>Free Plan</h4>
                    </div>
                    <div className='bg-gray-50 w-[100%] h-[55%] text-xl rounded-b-lg  text-gray-600 flex items-center justify-center'>
                        <ul className='font-semibold '>
                            <span className='flex items-center gap-2'><p className='text-green-500'><FaCheck /></p>15 free job postings.</span>
                            <span className='flex items-center gap-2'><p className='text-green-500'><FaCheck /></p>150 database per job posting.</span>
                        </ul>

                    </div>

                </div>
            </section>
        </>
    )
}

export default FreePlan