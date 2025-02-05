// import React, { useState } from 'react';
// import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
// import { Label } from '@/components/ui/label';

// const fitlerData = [
//     {
//         fitlerType: "Location",
//         array: [
//             "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujrat", "Haryana", 
//             "Himachal Pradesh", "Jharkhand", "Jammu and Kashmir", "Karnataka", "Kerala", "Ladakh", "Maharashtra",
//             "Madhya Pradesh", "Manipur", "Meghalya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", 
//             "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bangal", 
//             "Arizona", "California", "Florida", "Illinois", "New York", "North Carolina", "Ohio", "Pennsylvania", "Texas", 
//             "Remote"
//         ]
//     },
//     {
//         fitlerType: "Industry",
//         array: ["Frontend Developer", "Backend Developer", "FullStack Developer", "Website Designer", "Java Developer", "Data Science", "Graphic Designer", "Data Entry Operator", "Dotnet Developer"]
//     },
//     {
//         fitlerType: "Salary",
//         array: ["0-20k", "21k-40k", "41-1lakh", "1lakh-5lakh", "5lakh-10lakh", "12lakh-20lakh"]
//     },
// ];

// const FilterCard = () => {
//     const [visibleFilters, setVisibleFilters] = useState({
//         Location: false,
//         Industry: false,
//         Salary: false,
//     });

//     const toggleFilterVisibility = (filterType) => {
//         setVisibleFilters((prev) => ({
//             ...prev,
//             [filterType]: !prev[filterType],
//         }));
//     };

//     return (
//         <div className=" w-full sticky top-0 rounded-md">
//             <h1 className="font-bold text-lg">Filter Jobs</h1>
//             <hr className="mt-3" />
//             <RadioGroup className='flex flex-col space-y-4'>
//                 {fitlerData.map((data, index) => (
//                     <div key={index}>
//                         <div className="flex justify-between items-center">
//                             <h1 className="font-light text-lg">{data.fitlerType}</h1>
//                             <button
//                                 className={`text-lg font-bold px-2 py-1 rounded ${
//                                     visibleFilters[data.fitlerType] ? "bg-red-700 text-white" : "bg-blue-700 text-white"
//                                 }`}
//                                 onClick={() => toggleFilterVisibility(data.fitlerType)}
//                             >
//                                 {visibleFilters[data.fitlerType] ? "−" : "+"}
//                             </button>
//                         </div>
//                         {visibleFilters[data.fitlerType] && (
//                             data.array.map((item, idx) => {
//                                 const itemId = `id${index}-${idx}`;
//                                 return (
//                                     <div key={idx} className="flex items-center space-x-2 my-2">
//                                         <RadioGroupItem value={item} id={itemId} />
//                                         <Label htmlFor={itemId}>{item}</Label>
//                                     </div>
//                                 );
//                             })
//                         )}
//                     </div>
//                 ))}
//             </RadioGroup>
//         </div>
//     );
// };

// export default FilterCard;

import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Label } from "@/components/ui/label";

const filterData = [
  {
    filterType: "Location",
    array: [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
      "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
      "Jammu and Kashmir", "Karnataka", "Kerala", "Ladakh", "Maharashtra",
      "Madhya Pradesh", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
      "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
      "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Arizona",
      "California", "Florida", "Illinois", "New York", "North Carolina",
      "Ohio", "Pennsylvania", "Texas", "Remote"
    ]
  },
  {
    filterType: "Industry",
    array: [
      "Frontend Developer", "Backend Developer", "FullStack Developer",
      "Website Designer", "Java Developer", "Data Science",
      "Graphic Designer", "Data Entry Operator", "Dotnet Developer"
    ]
  }
];

const FilterCard = () => {
  const [visibleFilters, setVisibleFilters] = useState({
    Location: false,
    Industry: false,
    Salary: false,
  });

  const [salaryRange, setSalaryRange] = useState(50000); // Default salary range

  const toggleFilterVisibility = (filterType) => {
    setVisibleFilters((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
  };

  return (
    <div className="w-full sticky top-0 rounded-md">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="mt-3" />

      <RadioGroup className="flex flex-col space-y-4">
        {filterData.map((data, index) => (
          <div key={index}>
            <div className="flex justify-between items-center">
              <h1 className="font-light text-lg">{data.filterType}</h1>
              <button
                className={`text-lg font-bold px-2 py-1 rounded ${
                  visibleFilters[data.filterType] ? "bg-red-700 text-white" : "bg-blue-700 text-white"
                }`}
                onClick={() => toggleFilterVisibility(data.filterType)}
              >
                {visibleFilters[data.filterType] ? "−" : "+"}
              </button>
            </div>
            {visibleFilters[data.filterType] && (
              data.array.map((item, idx) => {
                const itemId = `id${index}-${idx}`;
                return (
                  <div key={idx} className="flex items-center space-x-2 my-2">
                    <RadioGroupItem value={item} id={itemId} />
                    <Label htmlFor={itemId}>{item}</Label>
                  </div>
                );
              })
            )}
          </div>
        ))}

        {/* Salary Slider */}
        <div>
          <div className="flex justify-between items-center">
            <h1 className="font-light text-lg">Salary</h1>
            <button
              className={`text-lg font-bold px-2 py-1 rounded ${
                visibleFilters.Salary ? "bg-red-700 text-white" : "bg-blue-700 text-white"
              }`}
              onClick={() => toggleFilterVisibility("Salary")}
            >
              {visibleFilters.Salary ? "−" : "+"}
            </button>
          </div>

          {visibleFilters.Salary && (
            <div className="mt-3">
              <input
                type="range"
                min="10000"
                max="2000000"
                step="5000"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className="w-full"
              />
              <p className="text-smtext-gray-600 mt-2">Salary: ₹{salaryRange.toLocaleString()} Yearly</p>
            </div>
          )}
        </div>
      </RadioGroup>
    </div>
  );
};

export default FilterCard;


