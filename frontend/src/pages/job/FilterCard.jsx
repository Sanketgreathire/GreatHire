import React from "react";
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

const FilterCard = ({ filters, onFilterChange, onReset, onClose }) => {

  const handleCheckboxChange = (category, value) => {
    const current = Array.isArray(filters[category]) ? filters[category] : [];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    onFilterChange?.({ ...filters, [category]: updated });
  };

  const handleDropdownChange = (category, value) => {
    onFilterChange?.({ ...filters, [category]: value });
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
    onFilterChange?.(resetFilters);
    onReset?.();
  };

  if (!filters) return null;

  return (
    <>

      <Helmet>
        <title>Advanced Job Search Filters | Locate Jobs by Role, Company, and Location - GreatHire</title>
        <meta
          name="description"
          content="Smarter job searching, powered by GreatHire's advanced job filters for precision and speed, helps you in finding opportunities that truly match your career goals. GreatHire, based in Hyderabad State, India, connects talented professionals with top companies through a user-friendly, modern hiring platform built for today's competitive job market. Be it a fresher or an experienced professional; our intelligent filtering system is here to help you uncover relevant openings faster, reduce noise, and focus only on the roles that matter."
        />
      </Helmet>

      {/* Mobile Overlay - Shows on small screens */}
      {onClose && (
        <div className="sm:hidden fixed inset-0 bg-black/50 z-30" onClick={onClose} />
      )}

      {/* Filter Card — CHANGE: reduced sm:w-[210px] md:w-[224px] to match lg:w-56 sidebar in Jobs.jsx */}
      <div className="fixed sm:static bottom-0 left-0 right-0 sm:bottom-auto sm:left-auto sm:right-auto w-full sm:w-[210px] md:w-[224px] bg-white dark:bg-gray-800 shadow-2xl sm:shadow-lg rounded-t-2xl sm:rounded-lg top-4 max-h-screen sm:max-h-[155vh] relative filter-scrollbar font-sans flex flex-col z-40 sm:z-auto">
        {onClose && (
          <button
            onClick={onClose}
            title="Close filters"
            className="absolute top-4 right-4 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 sm:hidden z-20 text-gray-600 dark:text-gray-400 transition-colors"
          >
            <IoMdClose size={28} />
          </button>
        )}

        {/* Header */}
        <div className="flex items-center justify-start gap-2 pt-4 sm:pt-8 px-4 sm:px-8 border-b border-gray-200 dark:border-gray-700 pb-3 bg-white dark:bg-gray-800 dark:text-gray-100 flex-shrink-0 rounded-t-2xl sm:rounded-t-lg">
          <FiFilter className="text-xl sm:text-2xl text-blue-500 dark:text-blue-400 flex-shrink-0" />
          <h2 className="text-base sm:text-xl font-semibold text-blue-600 dark:text-blue-400 truncate">Filters</h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-0 pb-20 sm:pb-4 pt-6 space-y-6">
          {/* Dropdown Filters */}
          {["jobTitle", "location"].map((category) => (
            <div key={category} className="mb-6">
              <label
                htmlFor={category}
                className="block text-gray-700 dark:text-gray-200 text-sm sm:text-base font-semibold tracking-wide mb-2"
              >
                {formatLabel(category)}
              </label>

              <select
                id={category}
                value={filters[category] || ""}
                onChange={(e) => handleDropdownChange(category, e.target.value)}
                className="w-full border border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-blue-400 dark:focus:border-blue-500 transition"
              >
                <option value="">All {formatLabel(category)}</option>
                {filterOptions[category].map((opt) => (
                  <option key={opt} value={opt} className="text-sm sm:text-base bg-white dark:bg-gray-700 dark:text-white">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Checkbox Filters */}
          {["jobType", "workPlace"].map((category) => (
            <div key={category} className="mb-6 border-b border-blue-300 dark:border-blue-700 pb-8">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm sm:text-base tracking-wide mb-3">
                {formatLabel(category)}
              </h3>
              <div className="space-y-2">
                {filterOptions[category].map((opt) => (
                  <label key={opt} className="flex items-center gap-3 text-sm sm:text-base cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={
                        Array.isArray(filters[category]) &&
                        filters[category].includes(opt)
                      }
                      onChange={() => handleCheckboxChange(category, opt)}
                      className="h-4 w-4 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600 cursor-pointer"
                    />
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                      {opt}
                    </span>
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
                className="block text-gray-700 dark:text-gray-200 text-sm sm:text-base font-semibold tracking-wide mb-2"
              >
                {formatLabel(category)}
              </label>

              <select
                id={category}
                value={filters[category] || ""}
                onChange={(e) => handleDropdownChange(category, e.target.value)}
                className="w-full border border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-blue-400 dark:focus:border-blue-500 transition"
              >
                <option value="">All {formatLabel(category)}</option>
                {filterOptions[category].map((opt) => (
                  <option key={opt} value={opt} className="text-sm sm:text-base bg-white dark:bg-gray-700 dark:text-white">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Checkbox Filters */}
          {["datePosted"].map((category) => (
            <div key={category} className="mb-6 pb-8">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm sm:text-base tracking-wide mb-3">
                {formatLabel(category)}
              </h3>
              <div className="space-y-2">
                {filterOptions[category].map((opt) => (
                  <label key={opt} className="flex items-center gap-3 text-sm sm:text-base cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={
                        Array.isArray(filters[category]) &&
                        filters[category].includes(opt)
                      }
                      onChange={() => handleCheckboxChange(category, opt)}
                      className="h-4 w-4 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600 cursor-pointer"
                    />
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Reset Button - Fixed at bottom on mobile */}
        <div className="fixed sm:static bottom-0 left-0 right-0 sm:bottom-auto sm:left-auto sm:right-auto flex justify-center gap-2 pt-3 pb-3 sm:pt-3 sm:pb-3 px-4 sm:px-8 bg-white dark:bg-gray-800 flex-shrink-0 border-t border-gray-200 dark:border-gray-700 shadow-lg sm:shadow-none rounded-t-2xl sm:rounded-none">
          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-6 py-2 rounded-full border border-blue-500 dark:border-blue-600 text-blue-600 dark:text-blue-400 text-sm sm:text-base font-semibold shadow-sm hover:bg-blue-600 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white transition"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterCard;