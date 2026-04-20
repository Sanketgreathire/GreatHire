import { useState } from "react";

const API = import.meta.env.VITE_API_URL + "/api/v1/courses";

export default function TalkToCounsellorModal({ courseName = "General", onClose }) {
  const [step, setStep] = useState("form"); // form | otp | done
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const startResendTimer = () => {
    setResendTimer(30);
    const t = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) { clearInterval(t); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    setError("");
    if (!form.name.trim()) { setError("Name is required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError("Valid email required"); return; }
    if (!/^\d{10}$/.test(form.phone)) { setError("Enter valid 10-digit mobile number"); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API}/counsellor/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, phone: form.phone }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to send OTP. Please try again.");
        return; // ✅ explicit return — do NOT proceed to setStep
      }

      setStep("otp");
      startResendTimer();
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (otp.length !== 6) { setError("Enter 6-digit OTP"); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API}/counsellor/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.phone, otp }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "OTP verification failed.");
        return;
      }

      // Save enquiry after successful OTP verification
      const enquiryRes = await fetch(`${API}/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, courseName, type: "counsellor", mode: "Online" }),
      });

      const enquiryData = await enquiryRes.json();
      if (!enquiryRes.ok || !enquiryData.success) {
        setError("Submission failed. Please try again.");
        return;
      }

      setStep("done");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/counsellor/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, phone: form.phone }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to resend OTP.");
        return;
      }

      startResendTimer();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 text-xl font-bold"
        >
          ×
        </button>

        {step === "done" ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">📞</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">We'll Call You Soon!</h3>
            <p className="text-gray-500 text-sm mb-6">
              Our counsellor will reach out to you within 2 hours. Check your email for confirmation.
            </p>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700"
            >
              Got it!
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-5 pb-4 border-b border-gray-100">
              <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mb-1">Talk to Counsellor</p>
              <h3 className="text-xl font-black text-gray-900">{courseName}</h3>
              <p className="text-sm text-gray-500 mt-1">📞 Get expert guidance — free consultation!</p>
            </div>

            {step === "form" && (
              <div className="space-y-4">
                {[
                  { label: "Full Name", key: "name", type: "text", placeholder: "Your full name" },
                  { label: "Email Address", key: "email", type: "email", placeholder: "you@example.com" },
                  { label: "Mobile Number", key: "phone", type: "tel", placeholder: "10-digit mobile number" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                      {label}
                    </label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={form[key]}
                      maxLength={key === "phone" ? 10 : undefined}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}

                {error && <p className="text-red-500 text-xs">{error}</p>}

                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors disabled:opacity-60"
                >
                  {loading ? "Sending OTP..." : "Send OTP →"}
                </button>
                <p className="text-center text-xs text-gray-400">OTP will be sent to your email</p>
              </div>
            )}

            {step === "otp" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  OTP sent to <span className="font-semibold text-gray-900">{form.email}</span>
                </p>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    maxLength={6}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-widest text-center text-lg font-bold"
                  />
                </div>

                {error && <p className="text-red-500 text-xs">{error}</p>}

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify & Submit →"}
                </button>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <button onClick={() => { setStep("form"); setOtp(""); setError(""); }} className="hover:text-blue-600">
                    ← Change details
                  </button>
                  <button
                    onClick={handleResend}
                    disabled={resendTimer > 0 || loading}
                    className={`${resendTimer > 0 ? "text-gray-300" : "hover:text-blue-600 text-blue-500"}`}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}