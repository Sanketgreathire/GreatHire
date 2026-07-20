import React from "react";
import { IoMdClose } from "react-icons/io";
import { FiFilter, FiMapPin } from "react-icons/fi";

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

// Maps a location to its "nearby" locations, driving the 99acres-style
// suggestion checkboxes that appear once a location is picked.
const nearbyLocationsMap = {
  // Hyderabad city areas — all nearby to each other
  "Amberpet, Hyderabad": ["Ameerpet, Hyderabad", "Himayathnagar, Hyderabad", "Musheerabad, Hyderabad", "Secunderabad, Hyderabad"],
  "Ameerpet, Hyderabad": ["Amberpet, Hyderabad", "Khairthabad, Hyderabad", "Nampally, Hyderabad", "Punjagutta, Hyderabad"],
  "Asifnagar, Hyderabad": ["Bahadurpura, Hyderabad", "Charminar, Hyderabad", "Nampally, Hyderabad"],
  "Bahadurpura, Hyderabad": ["Asifnagar, Hyderabad", "Charminar, Hyderabad", "Shaikpet, Hyderabad"],
  "Bandlaguda, Hyderabad": ["Charminar, Hyderabad", "Saidabad, Hyderabad", "Shaikpet, Hyderabad"],
  "Charminar, Hyderabad": ["Asifnagar, Hyderabad", "Bahadurpura, Hyderabad", "Bandlaguda, Hyderabad"],
  "Golconda, Hyderabad": ["Shaikpet, Hyderabad", "Asifnagar, Hyderabad", "Bahadurpura, Hyderabad"],
  "Himayathnagar, Hyderabad": ["Amberpet, Hyderabad", "Nampally, Hyderabad", "Khairthabad, Hyderabad"],
  "Khairthabad, Hyderabad": ["Ameerpet, Hyderabad", "Himayathnagar, Hyderabad", "Nampally, Hyderabad"],
  "Marredpally, Hyderabad": ["Secunderabad, Hyderabad", "Tirumalgiri, Hyderabad", "Tirumalagiry, Hyderabad"],
  "Musheerabad, Hyderabad": ["Amberpet, Hyderabad", "Secunderabad, Hyderabad", "Nampally, Hyderabad"],
  "Nampally, Hyderabad": ["Ameerpet, Hyderabad", "Himayathnagar, Hyderabad", "Khairthabad, Hyderabad"],
  "Saidabad, Hyderabad": ["Bandlaguda, Hyderabad", "Charminar, Hyderabad"],
  "Secunderabad, Hyderabad": ["Marredpally, Hyderabad", "Musheerabad, Hyderabad", "Tirumalgiri, Hyderabad"],
  "Shaikpet, Hyderabad": ["Golconda, Hyderabad", "Bahadurpura, Hyderabad", "Bandlaguda, Hyderabad"],
  "Tirumalgiri, Hyderabad": ["Secunderabad, Hyderabad", "Marredpally, Hyderabad", "Tirumalagiry, Hyderabad"],
  "Tirumalagiry, Hyderabad": ["Tirumalgiri, Hyderabad", "Secunderabad, Hyderabad", "Marredpally, Hyderabad"],

  // Same-state clusters (city-level)
  "Visakhapatnam, Andhra Pradesh": ["Vijayawada, Andhra Pradesh", "Guntur, Andhra Pradesh"],
  "Vijayawada, Andhra Pradesh": ["Visakhapatnam, Andhra Pradesh", "Guntur, Andhra Pradesh"],
  "Guntur, Andhra Pradesh": ["Vijayawada, Andhra Pradesh", "Visakhapatnam, Andhra Pradesh"],

  "Itanagar, Arunachal Pradesh": ["Tawang, Arunachal Pradesh", "Pasighat, Arunachal Pradesh"],
  "Tawang, Arunachal Pradesh": ["Itanagar, Arunachal Pradesh", "Pasighat, Arunachal Pradesh"],
  "Pasighat, Arunachal Pradesh": ["Itanagar, Arunachal Pradesh", "Tawang, Arunachal Pradesh"],

  "Guwahati, Assam": ["Silchar, Assam", "Dibrugarh, Assam"],
  "Silchar, Assam": ["Guwahati, Assam", "Dibrugarh, Assam"],
  "Dibrugarh, Assam": ["Guwahati, Assam", "Silchar, Assam"],

  "Patna, Bihar": ["Gaya, Bihar", "Bhagalpur, Bihar"],
  "Gaya, Bihar": ["Patna, Bihar", "Bhagalpur, Bihar"],
  "Bhagalpur, Bihar": ["Patna, Bihar", "Gaya, Bihar"],

  "Raipur, Chhattisgarh": ["Bhilai, Chhattisgarh", "Bilaspur, Chhattisgarh"],
  "Bhilai, Chhattisgarh": ["Raipur, Chhattisgarh", "Bilaspur, Chhattisgarh"],
  "Bilaspur, Chhattisgarh": ["Raipur, Chhattisgarh", "Bhilai, Chhattisgarh"],

  "Panaji, Goa": ["Margao, Goa", "Vasco da Gama, Goa"],
  "Margao, Goa": ["Panaji, Goa", "Vasco da Gama, Goa"],
  "Vasco da Gama, Goa": ["Panaji, Goa", "Margao, Goa"],

  "Ambala, Haryana": ["Faridabad, Haryana", "Gurugram, Haryana"],
  "Faridabad, Haryana": ["Ambala, Haryana", "Gurugram, Haryana"],
  "Gurugram, Haryana": ["Faridabad, Haryana", "Ambala, Haryana"],

  "Shimla, Himachal Pradesh": ["Dharamshala, Himachal Pradesh", "Mandi, Himachal Pradesh"],
  "Dharamshala, Himachal Pradesh": ["Shimla, Himachal Pradesh", "Mandi, Himachal Pradesh"],
  "Mandi, Himachal Pradesh": ["Shimla, Himachal Pradesh", "Dharamshala, Himachal Pradesh"],

  "Ranchi, Jharkhand": ["Jamshedpur, Jharkhand", "Dhanbad, Jharkhand"],
  "Jamshedpur, Jharkhand": ["Ranchi, Jharkhand", "Dhanbad, Jharkhand"],
  "Dhanbad, Jharkhand": ["Ranchi, Jharkhand", "Jamshedpur, Jharkhand"],

  "Bengaluru, Karnataka": ["Mysuru, Karnataka", "Mangalore, Karnataka"],
  "Mysuru, Karnataka": ["Bengaluru, Karnataka", "Mangalore, Karnataka"],
  "Mangalore, Karnataka": ["Bengaluru, Karnataka", "Mysuru, Karnataka"],

  "Thiruvananthapuram, Kerala": ["Kochi, Kerala", "Kozhikode, Kerala"],
  "Kochi, Kerala": ["Thiruvananthapuram, Kerala", "Kozhikode, Kerala"],
  "Kozhikode, Kerala": ["Thiruvananthapuram, Kerala", "Kochi, Kerala"],

  "Indore, Madhya Pradesh": ["Bhopal, Madhya Pradesh", "Gwalior, Madhya Pradesh"],
  "Bhopal, Madhya Pradesh": ["Indore, Madhya Pradesh", "Gwalior, Madhya Pradesh"],
  "Gwalior, Madhya Pradesh": ["Indore, Madhya Pradesh", "Bhopal, Madhya Pradesh"],

  "Mumbai, Maharashtra": ["Pune, Maharashtra", "Nagpur, Maharashtra", "Nashik, Maharashtra"],
  "Pune, Maharashtra": ["Mumbai, Maharashtra", "Nashik, Maharashtra", "Nagpur, Maharashtra"],
  "Nagpur, Maharashtra": ["Mumbai, Maharashtra", "Pune, Maharashtra"],
  "Nashik, Maharashtra": ["Mumbai, Maharashtra", "Pune, Maharashtra"],

  "Imphal, Manipur": ["Thoubal, Manipur", "Kakching, Manipur"],
  "Thoubal, Manipur": ["Imphal, Manipur", "Kakching, Manipur"],
  "Kakching, Manipur": ["Imphal, Manipur", "Thoubal, Manipur"],

  "Shillong, Meghalaya": ["Tura, Meghalaya", "Nongpoh, Meghalaya"],
  "Tura, Meghalaya": ["Shillong, Meghalaya", "Nongpoh, Meghalaya"],
  "Nongpoh, Meghalaya": ["Shillong, Meghalaya", "Tura, Meghalaya"],

  "Aizawl, Mizoram": ["Lunglei, Mizoram", "Champhai, Mizoram"],
  "Lunglei, Mizoram": ["Aizawl, Mizoram", "Champhai, Mizoram"],
  "Champhai, Mizoram": ["Aizawl, Mizoram", "Lunglei, Mizoram"],

  "Kohima, Nagaland": ["Dimapur, Nagaland", "Mokokchung, Nagaland"],
  "Dimapur, Nagaland": ["Kohima, Nagaland", "Mokokchung, Nagaland"],
  "Mokokchung, Nagaland": ["Kohima, Nagaland", "Dimapur, Nagaland"],

  "Bhubaneswar, Odisha": ["Cuttack, Odisha", "Rourkela, Odisha"],
  "Cuttack, Odisha": ["Bhubaneswar, Odisha", "Rourkela, Odisha"],
  "Rourkela, Odisha": ["Bhubaneswar, Odisha", "Cuttack, Odisha"],

  "Chandigarh, Punjab": ["Ludhiana, Punjab", "Amritsar, Punjab", "Chandigarh"],
  "Ludhiana, Punjab": ["Chandigarh, Punjab", "Amritsar, Punjab"],
  "Amritsar, Punjab": ["Chandigarh, Punjab", "Ludhiana, Punjab"],
  "Chandigarh": ["Chandigarh, Punjab", "Ambala, Haryana"],

  "Jaipur, Rajasthan": ["Udaipur, Rajasthan", "Jodhpur, Rajasthan"],
  "Udaipur, Rajasthan": ["Jaipur, Rajasthan", "Jodhpur, Rajasthan"],
  "Jodhpur, Rajasthan": ["Jaipur, Rajasthan", "Udaipur, Rajasthan"],

  "Gangtok, Sikkim": ["Namchi, Sikkim", "Pelling, Sikkim"],
  "Namchi, Sikkim": ["Gangtok, Sikkim", "Pelling, Sikkim"],
  "Pelling, Sikkim": ["Gangtok, Sikkim", "Namchi, Sikkim"],

  "Chennai, Tamil Nadu": ["Coimbatore, Tamil Nadu", "Madurai, Tamil Nadu"],
  "Coimbatore, Tamil Nadu": ["Chennai, Tamil Nadu", "Madurai, Tamil Nadu"],
  "Madurai, Tamil Nadu": ["Chennai, Tamil Nadu", "Coimbatore, Tamil Nadu"],

  "Hyderabad, Telangana": ["Warangal, Telangana", "Nizamabad, Telangana", "Secunderabad, Hyderabad", "Ameerpet, Hyderabad"],
  "Warangal, Telangana": ["Hyderabad, Telangana", "Nizamabad, Telangana"],
  "Nizamabad, Telangana": ["Hyderabad, Telangana", "Warangal, Telangana"],

  "Agartala, Tripura": ["Udaipur, Tripura", "Dharmanagar, Tripura"],
  "Udaipur, Tripura": ["Agartala, Tripura", "Dharmanagar, Tripura"],
  "Dharmanagar, Tripura": ["Agartala, Tripura", "Udaipur, Tripura"],

  "Lucknow, Uttar Pradesh": ["Kanpur, Uttar Pradesh", "Varanasi, Uttar Pradesh", "Noida, Uttar Pradesh"],
  "Kanpur, Uttar Pradesh": ["Lucknow, Uttar Pradesh", "Varanasi, Uttar Pradesh"],
  "Varanasi, Uttar Pradesh": ["Lucknow, Uttar Pradesh", "Kanpur, Uttar Pradesh"],
  "Noida, Uttar Pradesh": ["New Delhi, Delhi", "Gurugram, Haryana", "Lucknow, Uttar Pradesh"],

  "Dehradun, Uttarakhand": ["Haridwar, Uttarakhand", "Nainital, Uttarakhand"],
  "Haridwar, Uttarakhand": ["Dehradun, Uttarakhand", "Nainital, Uttarakhand"],
  "Nainital, Uttarakhand": ["Dehradun, Uttarakhand", "Haridwar, Uttarakhand"],

  "Kolkata, West Bengal": ["Siliguri, West Bengal", "Durgapur, West Bengal"],
  "Siliguri, West Bengal": ["Kolkata, West Bengal", "Durgapur, West Bengal"],
  "Durgapur, West Bengal": ["Kolkata, West Bengal", "Siliguri, West Bengal"],

  "New Delhi, Delhi": ["Gurugram, Haryana", "Noida, Uttar Pradesh"],
};

const FilterCard = ({ filters, onFilterChange, onReset, onClose }) => {

  const [locationSearch, setLocationSearch] = React.useState("");
  const [activeSearchLocation, setActiveSearchLocation] = React.useState(""); // which location's "nearby" list is showing

  const handleLocationToggle = (loc) => {
    const current = Array.isArray(filters.location) ? filters.location : [];
    const updated = current.includes(loc)
      ? current.filter((l) => l !== loc)
      : [...current, loc];
    onFilterChange?.({ ...filters, location: updated });
  };

  const handlePickSearchResult = (loc) => {
    handleLocationToggle(loc);
    setActiveSearchLocation(loc);
    setLocationSearch("");
  };

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
      location: [],
      jobType: [],
      workPlace: [],
      company: "",
      datePosted: [],
    };
    setLocationSearch("");
    setActiveSearchLocation("");
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
          {/* Job Title dropdown (location removed from this generic loop) */}
          {["jobTitle"].map((category) => (
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

          {/* Location — search bar, picks a location, reveals nearby as checkboxes */}
          <div className="mb-6 border-b border-blue-300 dark:border-blue-700 pb-6">
            <label className="block text-gray-700 dark:text-gray-200 text-sm sm:text-base font-semibold tracking-wide mb-2">
              Location
            </label>

            <input
              type="text"
              placeholder="Search a location (e.g. Hyderabad)"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              className="w-full border border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
            />

            {/* Search suggestions dropdown */}
            {locationSearch.trim() && (
              <div className="mt-1 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
                {filterOptions.location
                  .filter((loc) => loc.toLowerCase().includes(locationSearch.trim().toLowerCase()))
                  .slice(0, 15)
                  .map((loc) => (
                    <div
                      key={loc}
                      onClick={() => handlePickSearchResult(loc)}
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                    >
                      {loc}
                    </div>
                  ))}
                {filterOptions.location.filter((loc) =>
                  loc.toLowerCase().includes(locationSearch.trim().toLowerCase())
                ).length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-400">No matches found</div>
                )}
              </div>
            )}

            {/* Selected locations as removable chips */}
            {Array.isArray(filters.location) && filters.location.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {filters.location.map((loc) => (
                  <span
                    key={loc}
                    className="flex items-start gap-1.5 max-w-full bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-medium pl-3 pr-2 py-1.5 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
                  >
                    <FiMapPin size={12} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="break-words">{loc}</span>
                    <button
                      onClick={() => handleLocationToggle(loc)}
                      className="ml-0.5 w-4 h-4 flex items-center justify-center rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-500 hover:text-blue-700 transition-colors flex-shrink-0 mt-0.5"
                    >
                      <IoMdClose size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {/* Nearby locations as checkboxes, shown after a pick */}
            {activeSearchLocation && nearbyLocationsMap[activeSearchLocation] && (
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  People also search nearby:
                </p>
                <div className="space-y-2">
                  {nearbyLocationsMap[activeSearchLocation].map((nearLoc) => {
                    const checked = Array.isArray(filters.location) && filters.location.includes(nearLoc);
                    return (
                      <label key={nearLoc} className="flex items-center gap-2 text-sm cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleLocationToggle(nearLoc)}
                          className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200">
                          {nearLoc}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

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