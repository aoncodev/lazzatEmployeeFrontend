import React, { useState, useRef, useEffect } from "react";
import { KeyRound, AlertCircle } from "lucide-react";

const PinEntry = ({ onPinSubmit }) => {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    inputRefs[0].current.focus();
  }, []);

  const handleChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value && index < 3) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const pinString = pin.join("");
    if (pinString.length === 4) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/employee/${pinString}`
        );
        if (response.ok) {
          const employee = await response.json();
          if (employee) {
            onPinSubmit(pinString);
          }
        } else {
          throw new Error("Employee not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          <div className="flex items-center space-x-2">
            <KeyRound className="w-6 h-6 text-blue-600" />
            <span className="font-semibold text-lg">Employee Login</span>
          </div>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 text-center">
                Enter Your PIN
              </h2>

              <p className="text-sm text-gray-500 text-center">
                Please enter your 4-digit employee PIN to access the system
              </p>
            </div>

            {/* PIN Input Grid */}
            <div className="flex justify-between gap-3 sm:gap-4">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 sm:w-16 sm:h-16 text-center text-xl sm:text-2xl 
                            font-semibold bg-white border-2 border-gray-200 
                            rounded-lg focus:outline-none focus:border-blue-500 
                            focus:ring-4 focus:ring-blue-100 transition-all 
                            duration-200 shadow-sm hover:border-gray-300"
                  aria-label={`PIN digit ${index + 1}`}
                  disabled={loading}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start space-x-2 p-4 bg-red-50 rounded-lg text-red-700">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!pin.every((digit) => digit !== "") || loading}
              className={`w-full py-3 sm:py-4 rounded-lg text-white font-medium 
                         text-base sm:text-lg transition-all duration-300 
                         focus:outline-none focus:ring-4 
                         flex items-center justify-center space-x-2
                         disabled:opacity-50 disabled:cursor-not-allowed
                         ${
                           pin.every((digit) => digit !== "")
                             ? "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:ring-blue-200"
                             : "bg-gray-400"
                         }`}
            >
              {loading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <KeyRound className="w-5 h-5" />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Info */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Need help? Contact your supervisor or HR department
        </p>
      </main>
    </div>
  );
};

export default PinEntry;
