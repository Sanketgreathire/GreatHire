import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FiFilter } from "react-icons/fi";

// imported helmet to apply customized meta tags 
import { Helmet } from "react-helmet-async";

const formatLabel = (label) =>
  label
    .replace(/([a-z])([A-Z])/g, "$1 $2") // add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // capitalize first letter

const filterOptions = {
  jobTitle: [
    "Software Engineer", "React Developer", "Java Developer", "Frontend Developer",
    "Backend Developer", "Full Stack Developer", "Data Scientist",
    "Machine Learning Engineer", "AI Engineer", "Cybersecurity Analyst",
    "DevOps Engineer", "Cloud Engineer", "Database Administrator",
    "Blockchain Developer", "Game Developer", "Embedded Systems Engineer",
    "Mobile App Developer", "Product Manager", "Project Manager", "Business Analyst",
    "Scrum Master", "Marketing Manager", "Sales Executive", "SEO Analyst",
    "UI/UX Designer", "Graphic Designer", "Content Writer", "Teacher", "Professor",
    "Civil Engineer", "Mechanical Engineer", "Doctor", "Nurse", "Lawyer", "Judge",
    "Chef", "Tour Guide", "Athlete", "Police Officer", "Entrepreneur",
    "Customer Support Representative",
  ],
  location: [
    "Visakhapatnam, Andhra Pradesh", "Vijayawada, Andhra Pradesh", "Guntur, Andhra Pradesh",
    "Itanagar, Arunachal Pradesh", "Tawang, Arunachal Pradesh", "Pasighat, Arunachal Pradesh",
    "Guwahati, Assam", "Silchar, Assam", "Dibrugarh, Assam", "Patna, Bihar", "Gaya, Bihar",
    "Bhagalpur, Bihar", "Raipur, Chhattisgarh", "Bhilai, Chhattisgarh", "Bilaspur, Chhattisgarh",
    "Panaji, Goa", "Margao, Goa", "Vasco da Gama, Goa", "Chandigarh", "Ambala, Haryana",
    "Faridabad, Haryana", "Shimla, Himachal Pradesh", "Dharamshala, Himachal Pradesh",
    "Mandi, Himachal Pradesh", "Ranchi, Jharkhand", "Jamshedpur, Jharkhand", "Dhanbad, Jharkhand",
    "Bengaluru, Karnataka", "Mysuru, Karnataka", "Mangalore, Karnataka", "Thiruvananthapuram, Kerala",
    "Kochi, Kerala", "Kozhikode, Kerala", "Indore, Madhya Pradesh", "Bhopal, Madhya Pradesh",
    "Gwalior, Madhya Pradesh", "Mumbai, Maharashtra", "Pune, Maharashtra", "Nagpur, Maharashtra", "Nashik, Maharashtra",
    "Imphal, Manipur", "Thoubal, Manipur", "Kakching, Manipur", "Shillong, Meghalaya",
    "Tura, Meghalaya", "Nongpoh, Meghalaya", "Aizawl, Mizoram", "Lunglei, Mizoram",
    "Champhai, Mizoram", "Kohima, Nagaland", "Dimapur, Nagaland", "Mokokchung, Nagaland",
    "Bhubaneswar, Odisha", "Cuttack, Odisha", "Rourkela, Odisha", "Chandigarh, Punjab",
    "Ludhiana, Punjab", "Amritsar, Punjab", "Jaipur, Rajasthan", "Udaipur, Rajasthan",
    "Jodhpur, Rajasthan", "Gangtok, Sikkim", "Namchi, Sikkim", "Pelling, Sikkim",
    "Chennai, Tamil Nadu", "Coimbatore, Tamil Nadu", "Madurai, Tamil Nadu",
    "Hyderabad, Telangana", "Warangal, Telangana", "Nizamabad, Telangana",
    "Agartala, Tripura", "Udaipur, Tripura", "Dharmanagar, Tripura",
    "Lucknow, Uttar Pradesh", "Kanpur, Uttar Pradesh", "Varanasi, Uttar Pradesh",
    "Dehradun, Uttarakhand", "Haridwar, Uttarakhand", "Nainital, Uttarakhand",
    "Kolkata, West Bengal", "Siliguri, West Bengal", "Durgapur, West Bengal",
    "New Delhi, Delhi", "Gurugram, Haryana", "Noida, Uttar Pradesh", "Amberpet, Hyderabad",
    "Ameerpet, Hyderabad", "Asifnagar, Hyderabad", "Bahadurpura, Hyderabad",
    "Bandlaguda, Hyderabad", "Charminar, Hyderabad", "Golconda, Hyderabad", "Himayathnagar, Hyderabad",
    "Khairthabad, Hyderabad", "Marredpally, Hyderabad", "Musheerabad, Hyderabad",
    "Nampally, Hyderabad", "Saidabad, Hyderabad", "Secunderabad, Hyderabad",
    "Shaikpet, Hyderabad", "Tirumalgiri, Hyderabad", "Tirumalagiry, Hyderabad", "Remote",
  ],
  jobType: ["Full-time", "Part-time", "Contract", "Temporary", "Volunteer", "Internship"],
  workPlace: ["On-Site", "Remote", "Hybrid"],


  company: [
    // Top Tech Giants
    "GreatHire", "Google", "Microsoft", "Apple", "Amazon", "Meta", "Tesla", "IBM", "Oracle",
    "Intel", "Salesforce", "Adobe", "NVIDIA", "AMD", "Qualcomm", "SAP", "Siemens",
    // Global Product-Based Tech Companies
    "Uber", "Airbnb", "Spotify", "Netflix", "Twitter", "Snap Inc", "Zoom",
    "Shopify", "Dropbox", "Atlassian", "Slack", "Red Hat", "GitHub", "GitLab",
    "MongoDB", "Snowflake", "Palantir", "Stripe", "Square", "PayPal",
    // Indian IT Giants
    "Infosys", "TCS", "Wipro", "Accenture", "Capgemini", "Cognizant",
    "HCL Technologies", "Tech Mahindra", "L&T Infotech", "Mindtree",
    "Persistent Systems", "Mphasis", "Birlasoft", "Zensar Technologies",
    // Indian Unicorns / Startups
    "Byju's", "Swiggy", "Zomato", "Ola", "Oyo", "Paytm", "PhonePe",
    "Flipkart", "Nykaa", "Lenskart", "Meesho", "Razorpay", "PolicyBazaar",
    "Delhivery", "Freshworks", "Dream11", "CRED", "BigBasket",
    // Telecom
    "Jio", "Airtel", "Vodafone Idea", "AT&T", "Verizon", "T-Mobile",
    // Banking & Finance
    "JPMorgan Chase", "Goldman Sachs", "Morgan Stanley", "HSBC", "Barclays",
    "Bank of America", "Wells Fargo", "Citibank", "ICICI Bank", "HDFC Bank",
    "Axis Bank", "Kotak Mahindra Bank", "SBI", "Standard Chartered",
    // Consulting
    "Deloitte", "EY", "KPMG", "PwC", "McKinsey", "Boston Consulting Group", "Bain & Company",
    // E-Commerce
    "eBay", "Alibaba", "Walmart", "Target", "Etsy", "Myntra", "AJIO",
    // Gaming Companies
    "Electronic Arts", "Ubisoft", "Rockstar Games", "Epic Games",
    "Activision Blizzard", "Supercell", "Riot Games",
    // Cloud & DevOps
    "DigitalOcean", "Cloudflare", "Fastly", "HashiCorp", "Docker", "Kubernetes Foundation",
    // Semiconductor & Hardware
    "Texas Instruments", "Micron", "Broadcom", "ASUS", "Dell", "HP", "Lenovo", "Cisco",
    "Logitech", "Western Digital", "Seagate",
    // Automobile (Tech & EV)
    "BMW", "Mercedes-Benz", "Audi", "Ford", "General Motors", "Hyundai", "Kia",
    "Mahindra", "Tata Motors", "Ashok Leyland",
    // Pharma & Healthcare
    "Johnson & Johnson", "Pfizer", "Novartis", "AstraZeneca", "Merck", "Roche",
    "Dr. Reddy's Labs", "Sun Pharma", "Cipla", "Apollo Hospitals",
    // Media & Entertainment
    "Disney", "Warner Bros", "Sony", "Universal Studios", "Star India", "Zee Entertainment",
    // Hospitality & Travel
    "Marriott", "Hilton", "Hyatt", "MakeMyTrip", "Goibibo", "Yatra",
    // Logistics
    "FedEx", "DHL", "Blue Dart", "DTDC", "Ecom Express",
    // EdTech
    "Coursera", "Udemy", "Unacademy", "Simplilearn", "UpGrad",
    // Fashion & Lifestyle
    "H&M", "Zara", "Adidas", "Nike", "Puma",
    // FMCG
    "Hindustan Unilever", "Nestle", "PepsiCo", "Coca-Cola", "Dabur",
    "Britannia", "ITC Limited", "Marico", "Procter & Gamble",
    // Oil, Gas & Energy
    "ONGC", "Indian Oil", "BPCL", "HPCL", "Adani Group", "Reliance Industries",
    "Shell", "Chevron", "ExxonMobil",
    // Others (General Industries)
    "Tata Steel", "JSW Steel", "Godrej", "Aditya Birla Group", "Bajaj Group", "Larsen & Toubro"
  ],
  datePosted: ["Last 24 hours", "Last 7 days", "Last 15 days", "Past Month"],
};

const FilterCard = ({ onFilterChange, onReset, onClose }) => {
  const [filters, setFilters] = useState({
    jobTitle: "",
    location: "",
    jobType: [],
    workPlace: [],
    company: "",
    datePosted: [],
  });

  const handleCheckboxChange = (category, value) => {
    setFilters((prev) => {
      const current = Array.isArray(prev[category]) ? prev[category] : [];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];

      const newFilters = { ...prev, [category]: updated };

      // Immediately notify parent
      onFilterChange?.(newFilters);

      return newFilters;
    });
  };

  const handleDropdownChange = (category, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [category]: value };

      // Immediately notify parent
      onFilterChange?.(newFilters);

      return newFilters;
    });
  };

  const handleReset = () => {
    const resetFilters = {
      jobTitle: "",
      location: "",
      jobType: [],
      workPlace: [],
      company: "",
      datePosted: [],
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
    onReset?.();
  };

  return (

    <>

      <Helmet>
        <title>Advanced Job Search Filters | Find Jobs by Role, Company & Location – GreatHire</title>
        <meta
          name="description"
          content="Discover smarter job searching with GreatHire’s advanced job filters designed for precision and speed. Filter jobs by role, company, location, job type, workplace mode, and date posted to find opportunities that truly match your career goals. Based in Hyderabad State, India, GreatHire connects talented professionals with top companies through a modern, user-friendly hiring platform built for today’s competitive job market. Whether you’re a fresher or an experienced professional, our intelligent filtering system helps you uncover relevant openings faster, reduce noise, and focus only on roles that matter."
        />
      </Helmet>


      <div className="w-72 bg-white shadow-lg rounded-lg sticky top-4 h-[96vh] relative filter-scrollbar font-sans dark:bg-gray-700 flex flex-col">
        {onClose && (
          <button
            onClick={onClose}
            title="Close filters"
            className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100 lg:hidden z-20"
          >
            <IoMdClose size={18} />
          </button>
        )}

        {/* Header */}
        <div className="flex items-center justify-start gap-2 pt-8 px-8 border-b border-gray-600 pb-3 bg-white dark:text-gray-100 dark:bg-gray-700 flex-shrink-0 rounded-t-lg">
          <FiFilter className="text-2xl text-blue-500" />
          <h2 className="text-xl font-semibold text-blue-600">Filters</h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-4">
          {/* Dropdown Filters */}
          {["jobTitle", "location"].map((category) => (
            <div key={category} className="mb-6">
              <label
                htmlFor={category}
                className="dark:text-white block text-gray-700 text-lg font-semibold tracking-wide mb-2"
              >
                {formatLabel(category)}
              </label>

              <select
                id={category}
                value={filters[category]}
                onChange={(e) => handleDropdownChange(category, e.target.value)}
                className="w-full border border-blue-300 bg-white rounded-lg px-3 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition dark:text-black"
              >
                <option value="">All {formatLabel(category)}</option>
                {filterOptions[category].map((opt) => (
                  <option key={opt} value={opt} className="text-base">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Checkbox Filters */}
          {["jobType", "workPlace"].map((category) => (
            <div key={category} className="mb-6 border-b border-blue-300 pb-8">
              <h3 className="font-semibold text-gray-700 text-lg tracking-wide mb-3 dark:text-white">
                {formatLabel(category)}
              </h3>
              <div className="space-y-2">
                {filterOptions[category].map((opt) => (
                  <label key={opt} className="flex items-center gap-3 text-base cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        Array.isArray(filters[category]) &&
                        filters[category].includes(opt)
                      }
                      onChange={() => handleCheckboxChange(category, opt)}
                      className="h-4 w-4 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="dark:text-white">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Dropdown Filters */}
          {["company"].map((category) => (
            <div key={category} className="mb-6">
              <label
                htmlFor={category}
                className="dark:text-white block text-gray-700 text-lg font-semibold tracking-wide mb-2"
              >
                {formatLabel(category)}
              </label>

              <select
                id={category}
                value={filters[category]}
                onChange={(e) => handleDropdownChange(category, e.target.value)}
                className="w-full border border-blue-300 bg-white rounded-lg px-3 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition dark:text-black"
              >
                <option value="">All {formatLabel(category)}</option>
                {filterOptions[category].map((opt) => (
                  <option key={opt} value={opt} className="text-base">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Checkbox Filters */}
          {["datePosted"].map((category) => (
            <div key={category} className="mb-6 pb-8">
              <h3 className="font-semibold text-gray-700 text-lg tracking-wide mb-3 dark:text-white">
                {formatLabel(category)}
              </h3>
              <div className="space-y-2">
                {filterOptions[category].map((opt) => (
                  <label key={opt} className="flex items-center gap-3 text-base cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        Array.isArray(filters[category]) &&
                        filters[category].includes(opt)
                      }
                      onChange={() => handleCheckboxChange(category, opt)}
                      className="h-4 w-4 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="dark:text-white">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Reset */}
        <div className="flex justify-center gap-2 pt-3 pb-3 px-8 bg-white dark:bg-gray-700 flex-shrink-0 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="px-10 py-2 rounded-full border border-blue-500 text-blue-600 text-base font-semibold shadow-sm hover:bg-blue-600 hover:text-white transition dark:bg-blue-600 dark:hover:bg-blue-800 dark:text-white"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterCard;


// import React, { useState, useEffect } from "react";
// import { IoMdClose } from "react-icons/io";
// import { FiFilter } from "react-icons/fi";

// const formatLabel = (label) =>
//   label
//     .replace(/([a-z])([A-Z])/g, "$1 $2") // add space before capital letters
//     .replace(/^./, (str) => str.toUpperCase()); // capitalize first letter

// const filterOptions = {
//   jobType: ["Full-time", "Part-time", "Contract", "Temporary", "Volunteer", "Internship"],
//   datePosted: ["Last 24 hours", "Last 7 days", "Last 15 days", "Past Month"],
//   salary: [
//     "0-10000", "10000-20000", "20000-40000", "40000-60000",
//     "60000-80000", "80000-100000", "100000+",
//   ],
//   workPlace: ["On-Site", "Remote", "Hybrid"],
//   location: [
//     "Visakhapatnam, Andhra Pradesh", "Vijayawada, Andhra Pradesh", "Guntur, Andhra Pradesh",
//     "Itanagar, Arunachal Pradesh", "Tawang, Arunachal Pradesh", "Pasighat, Arunachal Pradesh",
//     "Guwahati, Assam", "Silchar, Assam", "Dibrugarh, Assam", "Patna, Bihar", "Gaya, Bihar",
//     "Bhagalpur, Bihar", "Raipur, Chhattisgarh", "Bhilai, Chhattisgarh", "Bilaspur, Chhattisgarh",
//     "Panaji, Goa", "Margao, Goa", "Vasco da Gama, Goa", "Chandigarh", "Ambala, Haryana",
//     "Faridabad, Haryana", "Shimla, Himachal Pradesh", "Dharamshala, Himachal Pradesh",
//     "Mandi, Himachal Pradesh", "Ranchi, Jharkhand", "Jamshedpur, Jharkhand", "Dhanbad, Jharkhand",
//     "Bengaluru, Karnataka", "Mysuru, Karnataka", "Mangalore, Karnataka", "Thiruvananthapuram, Kerala",
//     "Kochi, Kerala", "Kozhikode, Kerala", "Indore, Madhya Pradesh", "Bhopal, Madhya Pradesh",
//     "Gwalior, Madhya Pradesh", "Mumbai, Maharashtra", "Pune, Maharashtra", "Nagpur, Maharashtra", "Nashik, Maharashtra",
//     "Imphal, Manipur", "Thoubal, Manipur", "Kakching, Manipur", "Shillong, Meghalaya",
//     "Tura, Meghalaya", "Nongpoh, Meghalaya", "Aizawl, Mizoram", "Lunglei, Mizoram",
//     "Champhai, Mizoram", "Kohima, Nagaland", "Dimapur, Nagaland", "Mokokchung, Nagaland",
//     "Bhubaneswar, Odisha", "Cuttack, Odisha", "Rourkela, Odisha", "Chandigarh, Punjab",
//     "Ludhiana, Punjab", "Amritsar, Punjab", "Jaipur, Rajasthan", "Udaipur, Rajasthan",
//     "Jodhpur, Rajasthan", "Gangtok, Sikkim", "Namchi, Sikkim", "Pelling, Sikkim",
//     "Chennai, Tamil Nadu", "Coimbatore, Tamil Nadu", "Madurai, Tamil Nadu",
//     "Hyderabad, Telangana", "Warangal, Telangana", "Nizamabad, Telangana",
//     "Agartala, Tripura", "Udaipur, Tripura", "Dharmanagar, Tripura",
//     "Lucknow, Uttar Pradesh", "Kanpur, Uttar Pradesh", "Varanasi, Uttar Pradesh",
//     "Dehradun, Uttarakhand", "Haridwar, Uttarakhand", "Nainital, Uttarakhand",
//     "Kolkata, West Bengal", "Siliguri, West Bengal", "Durgapur, West Bengal",
//     "New Delhi, Delhi", "Gurugram, Haryana", "Noida, Uttar Pradesh", "Amberpet, Hyderabad",
//     "Ameerpet, Hyderabad", "Asifnagar, Hyderabad", "Bahadurpura, Hyderabad",
//     "Bandlaguda, Hyderabad", "Charminar, Hyderabad", "Golconda, Hyderabad", "Himayathnagar, Hyderabad",
//     "Khairthabad, Hyderabad", "Marredpally, Hyderabad", "Musheerabad, Hyderabad",
//     "Nampally, Hyderabad", "Saidabad, Hyderabad", "Secunderabad, Hyderabad",
//     "Shaikpet, Hyderabad", "Tirumalgiri, Hyderabad", "Tirumalagiry, Hyderabad", "Remote",
//   ],
//   jobTitle: [
//     "Software Engineer", "React Developer", "Java Developer", "Frontend Developer",
//     "Backend Developer", "Full Stack Developer", "Data Scientist",
//     "Machine Learning Engineer", "AI Engineer", "Cybersecurity Analyst",
//     "DevOps Engineer", "Cloud Engineer", "Database Administrator",
//     "Blockchain Developer", "Game Developer", "Embedded Systems Engineer",
//     "Mobile App Developer", "Product Manager", "Project Manager", "Business Analyst",
//     "Scrum Master", "Marketing Manager", "Sales Executive", "SEO Analyst",
//     "UI/UX Designer", "Graphic Designer", "Content Writer", "Teacher", "Professor",
//     "Civil Engineer", "Mechanical Engineer", "Doctor", "Nurse", "Lawyer", "Judge",
//     "Chef", "Tour Guide", "Athlete", "Police Officer", "Entrepreneur",
//     "Customer Support Representative",
//   ],
//   company: [
//   // Top Tech Giants
//   "GreatHire", "Google", "Microsoft", "Apple", "Amazon", "Meta", "Tesla", "IBM", "Oracle",
//   "Intel", "Salesforce", "Adobe", "NVIDIA", "AMD", "Qualcomm", "SAP", "Siemens",
//   // Global Product-Based Tech Companies
//   "Uber", "Airbnb", "Spotify", "Netflix", "Twitter", "Snap Inc", "Zoom",
//   "Shopify", "Dropbox", "Atlassian", "Slack", "Red Hat", "GitHub", "GitLab",
//   "MongoDB", "Snowflake", "Palantir", "Stripe", "Square", "PayPal",
//   // Indian IT Giants
//   "Infosys", "TCS", "Wipro", "Accenture", "Capgemini", "Cognizant",
//   "HCL Technologies", "Tech Mahindra", "L&T Infotech", "Mindtree",
//   "Persistent Systems", "Mphasis", "Birlasoft", "Zensar Technologies",
//   // Indian Unicorns / Startups
//   "Byju's", "Swiggy", "Zomato", "Ola", "Oyo", "Paytm", "PhonePe",
//   "Flipkart", "Nykaa", "Lenskart", "Meesho", "Razorpay", "PolicyBazaar",
//   "Delhivery", "Freshworks", "Dream11", "CRED", "BigBasket",
//   // Telecom
//   "Jio", "Airtel", "Vodafone Idea", "AT&T", "Verizon", "T-Mobile",
//   // Banking & Finance
//   "JPMorgan Chase", "Goldman Sachs", "Morgan Stanley", "HSBC", "Barclays",
//   "Bank of America", "Wells Fargo", "Citibank", "ICICI Bank", "HDFC Bank",
//   "Axis Bank", "Kotak Mahindra Bank", "SBI", "Standard Chartered",
//   // Consulting
//   "Deloitte", "EY", "KPMG", "PwC", "McKinsey", "Boston Consulting Group", "Bain & Company",
//   // E-Commerce
//   "eBay", "Alibaba", "Walmart", "Target", "Etsy", "Myntra", "AJIO",
//   // Gaming Companies
//   "Electronic Arts", "Ubisoft", "Rockstar Games", "Epic Games",
//   "Activision Blizzard", "Supercell", "Riot Games",
//   // Cloud & DevOps
//   "DigitalOcean", "Cloudflare", "Fastly", "HashiCorp", "Docker", "Kubernetes Foundation",
//   // Semiconductor & Hardware
//   "Texas Instruments", "Micron", "Broadcom", "ASUS", "Dell", "HP", "Lenovo", "Cisco",
//   "Logitech", "Western Digital", "Seagate",
//   // Automobile (Tech & EV)
//   "BMW", "Mercedes-Benz", "Audi", "Ford", "General Motors", "Hyundai", "Kia",
//   "Mahindra", "Tata Motors", "Ashok Leyland",
//   // Pharma & Healthcare
//   "Johnson & Johnson", "Pfizer", "Novartis", "AstraZeneca", "Merck", "Roche",
//   "Dr. Reddy’s Labs", "Sun Pharma", "Cipla", "Apollo Hospitals",
//   // Media & Entertainment
//   "Disney", "Warner Bros", "Sony", "Universal Studios", "Star India", "Zee Entertainment",
//   // Hospitality & Travel
//   "Marriott", "Hilton", "Hyatt", "MakeMyTrip", "Goibibo", "Yatra",
//   // Logistics
//   "FedEx", "DHL", "Blue Dart", "DTDC", "Ecom Express",
//   // EdTech
//   "Coursera", "Udemy", "Unacademy", "Simplilearn", "UpGrad",
//   // Fashion & Lifestyle
//   "H&M", "Zara", "Adidas", "Nike", "Puma",
//   // FMCG
//   "Hindustan Unilever", "Nestle", "PepsiCo", "Coca-Cola", "Dabur",
//   "Britannia", "ITC Limited", "Marico", "Procter & Gamble",
//   // Oil, Gas & Energy
//   "ONGC", "Indian Oil", "BPCL", "HPCL", "Adani Group", "Reliance Industries",
//   "Shell", "Chevron", "ExxonMobil",
//   // Others (General Industries)
//   "Tata Steel", "JSW Steel", "Godrej", "Aditya Birla Group", "Bajaj Group", "Larsen & Toubro"
//   ],
//   qualification: [
//     "Master's Degree", "Bachelor's Degree", "Doctoral Degree", "B.Tech",
//     "M.Tech", "MBA", "BCA", "MCA", "B.Sc", "M.Sc", "Diploma", "10th", "12th",
//     "Bsc.Computer Science", "B.Sc. Information Technology", "ITI", "PhD", "BA", "MA",
//     "BBA", "MBBS", "BDS", "LLB", "CA", "ICWA", "B.Sc. Agriculture",
//     "M.Sc. Agriculture", "B.Arch", "M.Arch", "BFA", "MFA", "B.Pharm", "M.Pharm",
//     "D.Pharm", "B.Ed", "M.Ed", "BHM", "MHM", "BVoc", "MVoc",
//   ],
// };

// const FilterCard = ({ onFilterChange, onReset, onClose }) => {
//   const [filters, setFilters] = useState({
//     jobType: [],
//     datePosted: [],
//     salary: [],
//     workPlace: [],
//     location: "",
//     jobTitle: "",
//     company: "",
//     qualification: "",
//   });

//   // Notify parent when filters change
//   useEffect(() => {
//     onFilterChange?.(filters);
//   }, [filters, onFilterChange]);

//   const handleCheckboxChange = (category, value) => {
//     const normalizedValue =
//       category === "salary" ? value.replace(/\s+/g, "") : value;

//     setFilters((prev) => {
//       const current = Array.isArray(prev[category]) ? prev[category] : [];
//       const updated = current.includes(normalizedValue)
//         ? current.filter((item) => item !== normalizedValue)
//         : [...current, normalizedValue];
//       return { ...prev, [category]: updated };
//     });
//   };

//   const handleDropdownChange = (category, value) => {
//     setFilters((prev) => ({ ...prev, [category]: value }));
//   };

//   const handleReset = () => {
//     const resetFilters = {
//       jobType: [],
//       datePosted: [],
//       salary: [],
//       workPlace: [],
//       location: "",
//       jobTitle: "",
//       company: "",
//       qualification: "",
//     };
//     setFilters(resetFilters);
//     onReset?.();
//   };

//   return (
//     <div className=" w-72 bg-white shadow-lg rounded-lg pr-8 pl-8 pb-8 sticky top-4 h-[90vh] overflow-y-auto relative filter-scrollbar font-sans  dark:bg-gray-700">
//       {onClose && (
//         <button
//           onClick={onClose}
//           title="Close filters"
//           className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100 lg:hidden "
//         >
//           <IoMdClose size={18} />
//         </button>
//       )}

//       {/* Header */}
//       <div className=" flex items-center justify-start gap-2 pt-8 border-b border-gray-600 pb-3 mb-4 sticky top-0 bg-white z-10 dark:text-gray-100 dark:bg-gray-700">
//         <FiFilter className="text-2xl text-blue-500 " />
//         <h2 className="text-xl font-semibold text-blue-600 ">Filters</h2>
//       </div>

//       {/* Checkbox Filters */}
//       {["jobType", "datePosted", "salary", "workPlace"].map(
//         (category) => (
//           <div key={category} className="mb-6 border-b border-blue-300 pb-8 ">
//             <h3 className="font-semibold text-gray-700 text-lg tracking-wide mb-3 dark:text-white">
//               {formatLabel(category)}
//             </h3>
//             <div className="space-y-2">
//               {filterOptions[category].map((opt) => {
//                 // ✅ Format salary labels for readability
//                 const displayLabel =
//                   category === "salary"
//                     ? opt.replace("-", " - ").replace("+", "+ ")
//                     : category === "jobType"
//                       ? opt.replace("-", " - ")
//                       : opt;

//                 return (
//                   <label
//                     key={opt}
//                     className="flex items-center gap-3 text-base cursor-pointer group font-sans "
//                   >
//                     <input
//                       type="checkbox"
//                       aria-label={displayLabel}
//                       checked={
//                         Array.isArray(filters[category]) &&
//                         filters[category].includes(
//                           category === "salary"
//                             ? opt.replace(/\s+/g, "")
//                             : opt
//                         )
//                       }
//                       onChange={() => handleCheckboxChange(category, opt)}
//                       className="h-4 w-4 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition dark:text-white"
//                     />
//                     <span className="text-gray-700 group-hover:text-blue-600 transition select-none font-sans dark:text-white">
//                       {displayLabel}
//                     </span>
//                   </label>
//                 );
//               })}
//             </div>
//           </div>

//         ))}

//       {/* Dropdown Filters */}
//       {["location", "jobTitle", "company", "qualification"].map((category) => (
//         <div key={category} className="mb-6 ">
//           <label
//             htmlFor={category}
//             className=" dark:text-white block text-gray-700 text-lg font-semibold tracking-wide mb-2 "
//           >
//             {formatLabel(category)}
//           </label>

//           <select
//             id={category}
//             value={filters[category]}
//             onChange={(e) => handleDropdownChange(category, e.target.value)}
//             className=" w-full border border-blue-300 bg-white rounded-lg px-3 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition dark:text-black"
//           >
//             <option value="">All {formatLabel(category)}</option>
//             {filterOptions[category].map((opt) => (
//               <option key={opt} value={opt} className="text-base">
//                 {opt}
//               </option>
//             ))}
//           </select>
//         </div>
//       ))}

//       {/* Reset */}
//       <div className="mt-4 flex gap-2 p-4">
//         <button
//           onClick={handleReset}
//           className="px-10 py-2 rounded-full border border-blue-500 text-blue-600 text-base font-semibold shadow-sm hover:bg-blue-600 hover:text-white transition dark:bg-blue-600 dark:hover:bg-blue-800 dark:text-white "
//         >
//           Reset Filters
//         </button>
//       </div>
//       <div />
//     </div>

//   );
// };

// export default FilterCard;