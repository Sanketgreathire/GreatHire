import { useState } from "react";

export default function CourseEnrollModal({ onClose, courseName, amount, accentColor = "violet" }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", batch: "Weekday Batch", mode: "Online" });
  const [loading, setLoading] = useState(false);

  const colorMap = {
    violet: { btn: "bg-violet-600 hover:bg-violet-700", ring: "focus:ring-violet-500", text: "text-violet-600 dark:text-violet-400" },
    blue:   { btn: "bg-blue-600 hover:bg-blue-700",     ring: "focus:ring-blue-500",   text: "text-blue-600 dark:text-blue-400" },
    orange: { btn: "bg-orange-500 hover:bg-orange-600", ring: "focus:ring-orange-400", text: "text-orange-500 dark:text-orange-400" },
    teal:   { btn: "bg-teal-500 hover:bg-teal-600",     ring: "focus:ring-teal-400",   text: "text-teal-600 dark:text-teal-400" },
    pink:   { btn: "bg-pink-500 hover:bg-pink-600",     ring: "focus:ring-pink-400",   text: "text-pink-500 dark:text-pink-400" },
    green:  { btn: "bg-green-600 hover:bg-green-700",   ring: "focus:ring-green-500",  text: "text-green-600 dark:text-green-400" },
    red:    { btn: "bg-red-600 hover:bg-red-700",       ring: "focus:ring-red-500",    text: "text-red-600 dark:text-red-400" },
    indigo: { btn: "bg-indigo-600 hover:bg-indigo-700", ring: "focus:ring-indigo-500", text: "text-indigo-600 dark:text-indigo-400" },
  };
  const c = colorMap[accentColor] || colorMap.violet;

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    if (!form.name || !form.email || !form.phone) return;
    setLoading(true);
    const sdkLoaded = await loadRazorpay();
    if (!sdkLoaded) {
      alert("Failed to load Razorpay. Check your internet connection.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/courses/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, courseName, amount }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: courseName,
        description: "Course Enrollment",
        handler: async (response) => {
          try {
            const vRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/courses/payment/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, enrollmentId: data.enrollmentId }),
            });
            const vData = await vRes.json();
            if (vData.success) {
              alert(`Payment successful! You are enrolled in ${courseName}.`);
              onClose();
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch {
            alert("Payment verification error. Please contact support.");
          }
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#7c3aed" },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        alert("Payment failed. Please try again.");
        setLoading(false);
      });
      rzp.open();
    } catch {
      alert("Failed to initiate payment. Please try again.");
      setLoading(false);
    }
  };

  const displayAmount = `₹${Number(amount).toLocaleString("en-IN")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* Container Background: White in Light theme / Dark slate in Dark theme */}
      <div className="bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md relative transition-colors">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 dark:text-gray-400 text-xl font-bold transition-colors"
        >
          ×
        </button>

        <div className="p-6">
          <div className="mb-5 pb-4 border-b border-gray-100 dark:border-slate-800">
            <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${c.text}`}>Enroll Now</p>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">{courseName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Course Fee: <span className={`font-bold ${c.text}`}>{displayAmount}</span> · EMI from ₹7,000/month
            </p>
          </div>

          <div className="space-y-4">
            {[
              { label: "Full Name", key: "name", type: "text", placeholder: "Enter your full name" },
              { label: "Email Address", key: "email", type: "email", placeholder: "Enter your email" },
              { label: "Phone Number", key: "phone", type: "tel", placeholder: "Enter 10 digits number" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">{label}</label>
                <input
                  required
                  type={type}
                  inputMode={key === "phone" ? "numeric" : undefined}
                  maxLength={key === "phone" ? 12 : undefined}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (key === "phone") {
                      value = value.replace(/\D/g, "");
                      if (value.length > 12) return;
                    }
                    setForm({ ...form, [key]: value });
                  }}
                  className={`w-full border border-gray-200 dark:border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-white bg-white dark:bg-slate-800/60 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 ${c.ring}`}
                />
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">Batch</label>
                <select 
                  value={form.batch} 
                  onChange={(e) => setForm({ ...form, batch: e.target.value })}
                  className={`w-full border border-gray-200 dark:border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white bg-white dark:bg-slate-800/60 focus:outline-none focus:ring-2 ${c.ring}`}
                >
                  <option className="dark:bg-slate-800">Weekday Batch</option>
                  <option className="dark:bg-slate-800">Weekend Batch</option>
                  <option className="dark:bg-slate-800">Fast Track</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-1.5">Mode</label>
                <select 
                  value={form.mode} 
                  onChange={(e) => setForm({ ...form, mode: e.target.value })}
                  className={`w-full border border-gray-200 dark:border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white bg-white dark:bg-slate-800/60 focus:outline-none focus:ring-2 ${c.ring}`}
                >
                  <option className="dark:bg-slate-800">Online</option>
                  <option className="dark:bg-slate-800">Offline</option>
                  <option className="dark:bg-slate-800">Hybrid</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handlePayment} 
              disabled={loading}
              className={`w-full ${c.btn} text-white font-bold py-3.5 rounded-xl text-sm transition-colors mt-1 disabled:opacity-60`}
            >
              {loading ? "Processing..." : `Pay ${displayAmount}`}
            </button>

            <p className="text-center text-xs text-gray-400 dark:text-slate-500">🔒 Secure payment via Razorpay</p>
          </div>
        </div>
      </div>
    </div>
  );
}