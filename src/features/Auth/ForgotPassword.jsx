import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { forgotPasswordThunk } from "../../redux/slices/userSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch =useDispatch()

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setMessage("");
  //   setError("");
  //   if (!email) {
  //     setError("Please enter your email address.");
  //     return;
  //   }
  //   // Simple email validation
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(email)) {
  //     setError("Please enter a valid email address.");
  //     return;
  //   }
  //   setLoading(true);

  // dispatch(ForgotPassword(email))
  //   // Simulate API call
  //   setTimeout(() => {
  //     setLoading(false);
  //     setMessage("If this email is registered, you will receive password reset instructions.");
  //     setEmail("");
  //   }, 1500);
  // };


   const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    dispatch(forgotPasswordThunk({ email }))
      .unwrap()
      .then((res) => {
        setMessage("If this email is registered, you will receive password reset instructions.");
        setEmail("");
      })
      .catch((err) => {
        setError(err.message || "Failed to send reset link.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow p-4" style={{ maxWidth: 400, width: "100%" }}>
        <h3 className="mb-3 text-center">Forgot Password</h3>
        <p className="text-muted text-center mb-4">Enter your email address and we'll send you instructions to reset your password.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          {message && <div className="alert alert-success py-2">{message}</div>}
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;