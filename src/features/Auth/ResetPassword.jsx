import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { ResetPasswordThunk } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    // 👇 Console log the formatted object
    // console.log({
    //   token:token,
    //   newPassword: password,
    //   confirmPassword: confirmPassword
    // });
    dispatch(ResetPasswordThunk({
      token: token,
      newPassword: password,
      confirmPassword: confirmPassword
    }))

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      navigate("/")
      setLoading(false);
      setMessage("Your password has been reset a has been sent to your email successfully!");
      setPassword("");
      setConfirmPassword("");
    }, 1500);
  };


  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow p-4" style={{ maxWidth: 400, width: "100%" }}>
        <h3 className="mb-3 text-center">Reset Password</h3>
        <p className="text-muted text-center mb-4">Enter your new password below.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          {message && <div className="alert alert-success py-2">{message}</div>}
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;