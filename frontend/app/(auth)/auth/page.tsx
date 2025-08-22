"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OtpInput from 'react-otp-input';
import { Toaster, toast } from 'react-hot-toast';
import axios from "axios";
import { BACKEND_URL } from "@/lib/utils";
function LoginPage() {
  const router = useRouter();
  const [isRequestButtonActive, setIsRequestButtonActive] = useState(true);
  const [email, setemail] = useState("");
  const [otp, setOTP] = useState("");
  const [activeState, setactiveState] = useState(1);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    setIsRequestButtonActive(isValidEmail(email));
  }, [email]);
  useEffect(() => {
    if (otp.length === 6) {
      setIsRequestButtonActive(true);
    }
  }, [otp]);

  const InitiateSignUp = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/initiate_signin`, {
        email: email
      });
      if (response.data.success === true) {
        toast.success(response.data.message);
        setactiveState(2);
      } else {
        toast.error(response.data.message);
        console.log(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to initiate sign in");
      console.log(error);
    }
  };
  const verifyOtp = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/signin`, {
        email: email,
        otp: otp
      });
      if (response.data.success === true) {
        toast.success(response.data.message || "Sign in successful");
        localStorage.setItem("token", response.data.token);
        router.push("/ask");
        setactiveState(1);
      } else {
        toast.error(response.data.message);
        console.log(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to initiate sign in");
      console.log(error);
    }
  };

  const handleRequestOtp = async () => {
    if (!isRequestButtonActive) return;
    if (activeState === 1) {
      if (email && isValidEmail(email)) {
        setIsRequestButtonActive(false);
        //sign in with email logic
        await InitiateSignUp();
      } else {
        toast.error("Please enter a valid email address.");
      }
      setIsRequestButtonActive(false);

    } else {
      if (otp.length !== 6) {
        toast.error("Please enter a valid otp.");
        return;
      }
      //verify otp logic
      await verifyOtp();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full border bg-[#2a2e34]">
      <Toaster position="bottom-right" reverseOrder={false} />
      <div className="border border-white/30 py-8 px-5 rounded-2xl">
        <div className="flex flex-col items-center justify-center py-10 px-24 bg-[#fff8a5] border border-yellow-400 rounded-2xl">
          <div className="border border-yellow-400/80 px-3 py-0.5 rounded-full bg-yellow-400 text-black text-[10px]">{activeState === 1 ? "SignIn" : "Verification"}</div>
          <div className="text-2xl font-bold text-black mt-2">
            {activeState === 1 ? "Let's get you started!" : "Enter Verification Code"}
          </div>
        </div>
        <div className="mt-10">
          {
            activeState === 1 ? (
              <div className="w-full">
                <label htmlFor="email">Email</label>
                <input value={email} onChange={(e) => setemail(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleRequestOtp() }} type="email" name="email" id="email" className="border border-white/30 p-2 rounded-lg w-full outline-none mt-2" placeholder="Enter your email address" />
              </div>
            ) : (
              <div className="w-full flex flex-col justify-center ">
                <label htmlFor="otp">Verification Code</label>
                <div className=" mt-2">
                  <OtpInput
                    value={otp}
                    onChange={setOTP}
                    numInputs={6}
                    renderSeparator={<span></span>}
                    renderInput={(props) => <input {...props} />}
                    inputStyle={{
                      width: "40px",
                      height: "40px",
                      margin: "0 5px",
                      fontSize: "20px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      textAlign: "center",
                    }}
                    shouldAutoFocus
                  />
                </div>
              </div>
            )
          }
          <div className="text-xs pt-2 pl-1 text-white/50">
            {activeState === 1 ? "We'll never share your email with anyone else." : `We've sent a 6-digit verification code to ` + email + `.`}
          </div>
          <div onClick={handleRequestOtp} className={`mt-10 py-2 rounded-lg flex justify-center items-center 0 ${isRequestButtonActive ? "cursor-pointer border text-black border-yellow-400 bg-[#fcefb4e7]" : "cursor-not-allowed bg-[#fcefb4]/70 text-black/50 border border-yellow-400/50"}`}>
            {activeState === 1 ? "Request OTP" : "Verify"}
          </div>
        </div>
        <div className="text-xs pt-2 pl-1 text-white/50">
          By proceeding, you agree to our <strong>Terms</strong> and <strong>Privacy Policy</strong>.
        </div>
      </div>
      <div className="text-xs pt-2 pl-1 text-white/50">
        All Rights Reserved © 2025. <strong>1ai.co</strong>
      </div>
    </div>
  );
}

export default LoginPage;
