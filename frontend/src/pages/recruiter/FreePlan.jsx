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
                    Free Hiring Plan | Post Jobs & Access Candidates at No Cost – GreatHire
                </title>

                {/* Meta Description */}
                <meta
                    name="description"
                    content="Explore the GreatHire Free Plan designed for startups and recruiters who want to hire smarter. Hyderabad State India based platform offers 15 free job postings and access to 150 candidate profiles per job, helping you evaluate talent efficiently and confidently. GreatHire empowers employers, recruiters, and HR teams across growing business ecosystems with reliable hiring tools, transparent recruitment workflows, and scalable solutions. Start your hiring journey today with a risk-free plan built to deliver real value, measurable results, and trusted recruitment performance."
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