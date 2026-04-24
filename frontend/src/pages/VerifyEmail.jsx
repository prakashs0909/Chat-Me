import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const { rawid } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axiosInstance.get(`/auth/verify-email/${rawid}`);
        setStatus("success");
        toast.success("Email verified successfully");

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        setStatus("error");
        toast.error(error.response?.data?.message || "Verification failed");
      }
    };

    verifyEmail();
  }, [rawid, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8 text-center">
        
        {status === "loading" && (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/20">
              <Loader2 className="h-10 w-10 text-blue-400 animate-spin" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">
              Verifying your email
            </h1>

            <p className="text-slate-300">
              Please wait while we confirm your verification link.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
              <CheckCircle className="h-11 w-11 text-green-400" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">
              Email Verified!
            </h1>

            <p className="text-slate-300 mb-6">
              Your account has been verified successfully.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full rounded-xl bg-green-500 py-3 font-semibold text-white hover:bg-green-600 transition"
            >
              Go to Login
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
              <XCircle className="h-11 w-11 text-red-400" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">
              Verification Failed
            </h1>

            <p className="text-slate-300 mb-6">
              This link may be invalid or expired. Try logging in again to receive a new verification link.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full rounded-xl bg-red-500 py-3 font-semibold text-white hover:bg-red-600 transition"
            >
              Back to Login
            </button>
          </>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-400">
          <Mail className="h-4 w-4" />
          <span>Chat Me Email Verification</span>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;