import React, { useState, useRef, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { FiMapPin } from "react-icons/fi";
import { useSelector } from "react-redux";

// ── All filter option lists ───────────────────────────────────────────────────
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
    "Bengaluru, Karnataka", "Mysuru, Karnataka", "Mangalore, Karnataka",
    "Thiruvananthapuram, Kerala", "Kochi, Kerala", "Kozhikode, Kerala",
    "Indore, Madhya Pradesh", "Bhopal, Madhya Pradesh", "Gwalior, Madhya Pradesh",
    "Mumbai, Maharashtra", "Pune, Maharashtra", "Nagpur, Maharashtra", "Nashik, Maharashtra",
    "Imphal, Manipur", "Thoubal, Manipur", "Kakching, Manipur",
    "Shillong, Meghalaya", "Tura, Meghalaya", "Nongpoh, Meghalaya",
    "Aizawl, Mizoram", "Lunglei, Mizoram", "Champhai, Mizoram",
    "Kohima, Nagaland", "Dimapur, Nagaland", "Mokokchung, Nagaland",
    "Bhubaneswar, Odisha", "Cuttack, Odisha", "Rourkela, Odisha",
    "Chandigarh, Punjab", "Ludhiana, Punjab", "Amritsar, Punjab",
    "Jaipur, Rajasthan", "Udaipur, Rajasthan", "Jodhpur, Rajasthan",
    "Gangtok, Sikkim", "Namchi, Sikkim", "Pelling, Sikkim",
    "Chennai, Tamil Nadu", "Coimbatore, Tamil Nadu", "Madurai, Tamil Nadu",
    "Hyderabad, Telangana", "Warangal, Telangana", "Nizamabad, Telangana",
    "Agartala, Tripura", "Udaipur, Tripura", "Dharmanagar, Tripura",
    "Lucknow, Uttar Pradesh", "Kanpur, Uttar Pradesh", "Varanasi, Uttar Pradesh",
    "Dehradun, Uttarakhand", "Haridwar, Uttarakhand", "Nainital, Uttarakhand",
    "Kolkata, West Bengal", "Siliguri, West Bengal", "Durgapur, West Bengal",
    "New Delhi, Delhi", "Gurugram, Haryana", "Noida, Uttar Pradesh",
    "Amberpet, Hyderabad", "Ameerpet, Hyderabad", "Secunderabad, Hyderabad", "Remote",
  ],
  jobType: ["Full-time", "Part-time", "Contract", "Temporary", "Volunteer", "Internship"],
  workPlace: ["On-Site", "Remote", "Hybrid"],
  company: [
    "GreatHire", "Google", "Microsoft", "Apple", "Amazon", "Meta", "Tesla", "IBM", "Oracle",
    "Intel", "Salesforce", "Adobe", "NVIDIA", "AMD", "Qualcomm", "SAP", "Siemens",
    "Uber", "Airbnb", "Spotify", "Netflix", "Twitter", "Snap Inc", "Zoom",
    "Shopify", "Dropbox", "Atlassian", "Slack", "Red Hat", "GitHub", "GitLab",
    "MongoDB", "Snowflake", "Palantir", "Stripe", "Square", "PayPal",
    "Infosys", "TCS", "Wipro", "Accenture", "Capgemini", "Cognizant",
    "HCL Technologies", "Tech Mahindra", "L&T Infotech", "Mindtree",
    "Persistent Systems", "Mphasis", "Birlasoft", "Zensar Technologies",
    "Byju's", "Swiggy", "Zomato", "Ola", "Oyo", "Paytm", "PhonePe",
    "Flipkart", "Nykaa", "Lenskart", "Meesho", "Razorpay", "PolicyBazaar",
    "Delhivery", "Freshworks", "Dream11", "CRED", "BigBasket",
    "Jio", "Airtel", "Vodafone Idea", "AT&T", "Verizon", "T-Mobile",
    "JPMorgan Chase", "Goldman Sachs", "Morgan Stanley", "HSBC", "Barclays",
    "Bank of America", "Wells Fargo", "Citibank", "ICICI Bank", "HDFC Bank",
    "Axis Bank", "Kotak Mahindra Bank", "SBI", "Standard Chartered",
    "Deloitte", "EY", "KPMG", "PwC", "McKinsey", "Boston Consulting Group", "Bain & Company",
    "eBay", "Alibaba", "Walmart", "Target", "Etsy", "Myntra", "AJIO",
    "Electronic Arts", "Ubisoft", "Rockstar Games", "Epic Games",
    "Activision Blizzard", "Supercell", "Riot Games",
    "DigitalOcean", "Cloudflare", "Fastly", "HashiCorp", "Docker",
    "Texas Instruments", "Micron", "Broadcom", "ASUS", "Dell", "HP", "Lenovo", "Cisco",
    "BMW", "Mercedes-Benz", "Audi", "Ford", "General Motors", "Hyundai", "Kia",
    "Mahindra", "Tata Motors", "Ashok Leyland",
    "Johnson & Johnson", "Pfizer", "Novartis", "AstraZeneca", "Merck", "Roche",
    "Dr. Reddy's Labs", "Sun Pharma", "Cipla", "Apollo Hospitals",
    "Disney", "Warner Bros", "Sony", "Universal Studios", "Star India", "Zee Entertainment",
    "Marriott", "Hilton", "Hyatt", "MakeMyTrip", "Goibibo", "Yatra",
    "FedEx", "DHL", "Blue Dart", "DTDC", "Ecom Express",
    "Coursera", "Udemy", "Unacademy", "Simplilearn", "UpGrad",
    "H&M", "Zara", "Adidas", "Nike", "Puma",
    "Hindustan Unilever", "Nestle", "PepsiCo", "Coca-Cola", "Dabur",
    "Britannia", "ITC Limited", "Marico", "Procter & Gamble",
    "ONGC", "Indian Oil", "BPCL", "HPCL", "Adani Group", "Reliance Industries",
    "Shell", "Chevron", "ExxonMobil",
    "Tata Steel", "JSW Steel", "Godrej", "Aditya Birla Group", "Bajaj Group", "Larsen & Toubro",
  ],
  datePosted: ["Last 24 hours", "Last 7 days", "Last 15 days", "Past Month"],
};

// ── Reusable dropdown select pill ────────────────────────────────────────────
const FilterSelect = ({ label, id, value, onChange, options, defaultLabel }) => (
  <div className="relative">
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        appearance-none cursor-pointer pl-3 pr-7 py-1.5 rounded-full border text-sm font-medium
        transition-all duration-150 outline-none
        ${value
          ? "bg-[#0a7a56] border-[#0a7a56] text-white"
          : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-gray-400"
        }
      `}
    >
      <option value="">{defaultLabel || `All ${label}`}</option>
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          {opt}
        </option>
      ))}
    </select>
    <span className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs ${value ? "text-white/80" : "text-gray-400"}`}>
      ▾
    </span>
  </div>
);

// ── Main InlineFilterBar component ───────────────────────────────────────────
// Props:
//   filters         — filter state object from parent
//   onFilterChange  — (newFilters) => void
//   onReset         — () => void
//   jobs            — full jobs array (for Applied count)
//   appliedActive   — boolean (from parent)
//   onAppliedToggle — (bool) => void  (parent sets state)
const InlineFilterBar = ({
  filters,
  onFilterChange,
  onReset,
  jobs = [],
  appliedActive = false,
  onAppliedToggle,
}) => {
  const { user } = useSelector((state) => state.auth);
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationDrop, setShowLocationDrop] = useState(false);
  const locationRef = useRef(null);

  // Close location dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setShowLocationDrop(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Applied count ──────────────────────────────────────────────────────────
  const userId = user?._id ? String(user._id) : null;
  const appliedCount = userId
    ? jobs.filter((job) =>
        job.application?.some((app) => {
          const appId = String(app.applicant?._id || app.applicant);
          return appId === userId;
        })
      ).length
    : 0;

  // ── Filter helpers ─────────────────────────────────────────────────────────
  const setFilter = (key, val) =>
    onFilterChange?.({ ...filters, [key]: val });

  const setArrayFilter = (key, val) =>
    onFilterChange?.({ ...filters, [key]: val ? [val] : [] });

  const handleLocationPick = (loc) => {
    const current = Array.isArray(filters.location) ? filters.location : [];
    if (!current.includes(loc)) {
      onFilterChange?.({ ...filters, location: [...current, loc] });
    }
    setLocationSearch("");
    setShowLocationDrop(false);
  };

  const removeLocation = (loc) => {
    onFilterChange?.({
      ...filters,
      location: (filters.location || []).filter((l) => l !== loc),
    });
  };

  const handleReset = () => {
    setLocationSearch("");
    onAppliedToggle?.(false);
    onReset?.();
  };

  // ── Derived values for selects ─────────────────────────────────────────────
  const jobTitleVal    = filters.jobTitle || "";
  const jobTypeVal     = Array.isArray(filters.jobType)     && filters.jobType.length     > 0 ? filters.jobType[0]     : "";
  const workPlaceVal   = Array.isArray(filters.workPlace)   && filters.workPlace.length   > 0 ? filters.workPlace[0]   : "";
  const companyVal     = filters.company || "";
  const datePostedVal  = Array.isArray(filters.datePosted)  && filters.datePosted.length  > 0 ? filters.datePosted[0]  : "";
  const experienceVal  = filters.fresher ? "Fresher" : filters.experienced ? "Experience" : "";

  const hasAnyFilter =
    jobTitleVal || jobTypeVal || workPlaceVal || companyVal ||
    datePostedVal || experienceVal || (filters.location?.length > 0) || appliedActive;

  const filteredLocSuggestions = locationSearch.trim()
    ? filterOptions.location
        .filter((l) => l.toLowerCase().includes(locationSearch.trim().toLowerCase()))
        .slice(0, 12)
    : [];

  return (
    <div className="w-full mt-3 mb-1">
      <div className="flex flex-wrap items-center gap-2 justify-center">

        {/* ── Job Title ── */}
        <FilterSelect
          label="Job Title"
          id="inline-jobTitle"
          value={jobTitleVal}
          onChange={(val) => setFilter("jobTitle", val)}
          options={filterOptions.jobTitle}
        />

        {/* ── Location (custom search pill) ── */}
        <div className="relative" ref={locationRef}>
          <button
            type="button"
            onClick={() => setShowLocationDrop((p) => !p)}
            className={`
              inline-flex items-center gap-1.5 pl-3 pr-3 py-1.5 rounded-full border text-sm font-medium
              transition-all duration-150 cursor-pointer
              ${(filters.location?.length > 0)
                ? "bg-[#0a7a56] border-[#0a7a56] text-white"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-gray-400"
              }
            `}
          >
            <FiMapPin size={13} />
            <span>
              {filters.location?.length > 0
                ? `Location (${filters.location.length})`
                : "Location"}
            </span>
            <span className={`text-xs ${filters.location?.length > 0 ? "text-white/80" : "text-gray-400"}`}>▾</span>
          </button>

          {showLocationDrop && (
            <div className="absolute left-0 top-full mt-1.5 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl w-72 p-3">
              <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 mb-2">
                <IoIosSearch size={16} className="text-gray-400 flex-shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search a location…"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="flex-1 outline-none text-sm bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-400"
                />
              </div>

              {filteredLocSuggestions.length > 0 && (
                <div className="max-h-44 overflow-y-auto space-y-0.5">
                  {filteredLocSuggestions.map((loc) => (
                    <div
                      key={loc}
                      onClick={() => handleLocationPick(loc)}
                      className="px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                      {loc}
                    </div>
                  ))}
                </div>
              )}
              {locationSearch.trim() && filteredLocSuggestions.length === 0 && (
                <p className="text-sm text-gray-400 px-2 py-1">No matches found</p>
              )}

              {filters.location?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                  {filters.location.map((loc) => (
                    <span
                      key={loc}
                      className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded-full"
                    >
                      {loc}
                      <button onClick={() => removeLocation(loc)} className="ml-0.5 hover:text-blue-900 dark:hover:text-blue-100">
                        <IoMdClose size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Job Type ── */}
        <FilterSelect
          label="Job Type"
          id="inline-jobType"
          value={jobTypeVal}
          onChange={(val) => setArrayFilter("jobType", val)}
          options={filterOptions.jobType}
        />

        {/* ── Work Place ── */}
        <FilterSelect
          label="Work Place"
          id="inline-workPlace"
          value={workPlaceVal}
          onChange={(val) => setArrayFilter("workPlace", val)}
          options={filterOptions.workPlace}
        />

        {/* ── Company ── */}
        <FilterSelect
          label="Company"
          id="inline-company"
          value={companyVal}
          onChange={(val) => setFilter("company", val)}
          options={filterOptions.company}
        />

        {/* ── Date Posted ── */}
        <FilterSelect
          label="Date Posted"
          id="inline-datePosted"
          value={datePostedVal}
          onChange={(val) => setArrayFilter("datePosted", val)}
          options={filterOptions.datePosted}
          defaultLabel="Any Time"
        />

        {/* ── Fresher / Experience ── */}
        <div className="relative">
          <select
            value={experienceVal}
            onChange={(e) => {
              const val = e.target.value;
              onFilterChange?.({
                ...filters,
                fresher: val === "Fresher",
                experienced: val === "Experience",
              });
            }}
            className={`
              appearance-none cursor-pointer pl-3 pr-7 py-1.5 rounded-full border text-sm font-medium
              transition-all duration-150 outline-none
              ${experienceVal
                ? "bg-[#0a7a56] border-[#0a7a56] text-white"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-gray-400"
              }
            `}
          >
            <option value="">Experience Level</option>
            <option value="Fresher">Fresher</option>
            <option value="Experience">Experience</option>
          </select>
          <span className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs ${experienceVal ? "text-white/80" : "text-gray-400"}`}>
            ▾
          </span>
        </div>

        {/* ── Divider ── */}
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* ── Applied pill (only for logged-in users) ── */}
        {user && (
          <button
            type="button"
            onClick={() => onAppliedToggle?.(!appliedActive)}
            className={`
              inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-sm font-medium
              transition-all duration-150 select-none whitespace-nowrap cursor-pointer
              ${appliedActive
                ? "bg-[#0a7a56] border-[#0a7a56] text-white shadow-sm"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-gray-400"
              }
            `}
          >
            Applied
            {appliedCount > 0 && (
              <span className={`text-xs font-semibold ${appliedActive ? "text-white/90" : "text-gray-500 dark:text-gray-400"}`}>
                · {appliedCount}
              </span>
            )}
          </button>
        )}

        {/* ── Reset (only when something is active) ── */}
        {hasAnyFilter && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-red-300 dark:border-red-700 text-red-500 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
          >
            <IoMdClose size={13} />
            Reset
          </button>
        )}

      </div>
    </div>
  );
};

export default InlineFilterBar;
