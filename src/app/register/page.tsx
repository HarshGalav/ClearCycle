"use client";

import React, { useState } from "react";
import { ClockLoader } from "react-spinners";
import axios from "axios";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import useDebounce from "@/hooks/debounce";
import { Error } from "@/types/ErrorTypes";
import Toast from "@/utils/toast";

const Page = () => {
    const router = useRouter();
    const [userName, setUserName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [passwordMismatch, setPasswordMismatch] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handlePasswordChange = useDebounce((value) => {
        setPassword(value);
        if (confirmPassword && confirmPassword !== value) {
            setPasswordMismatch(true);
        } else {
            setPasswordMismatch(false);
        }
    }, 800);

    const handleConfirmPasswordChange = useDebounce((value) => {
        setConfirmPassword(value);
        if (password && password !== value) {
            setPasswordMismatch(true);
        } else {
            setPasswordMismatch(false);
        }
    }, 800);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            const UserData = {
                username: userName,
                email: email,
                password: password,
                phoneNumber: phoneNumber,
            };
            const res = await axios.post("/api/register", UserData);
            if (res) {
                Toast.SuccessshowToast(`Email sent to ${email} please verify` || "Something went wrong");
            } else {
                Toast.ErrorShowToast("Something went wrong");
            }
            router.push("/login");
        } catch (error: unknown) {
            const Error = error as Error;
            Toast.ErrorShowToast(Error?.response?.data?.error || "Something went wrong");
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Link href={"/login"} className=" font-bold text-lg p-4 flex items-center gap-2">
                <ArrowLeft />
                <h1>Back</h1>
            </Link>
            <section className="flex min-h-[60vh] justify-center items-center ">
                <div className=" bg-white/20 shadow-md  shadow-white/70 w-full md:w-1/2 2xl:w-1/3 m-4 md:m-auto p-4 rounded-lg">
                    <h1 className="font-semibold text-2xl text-center mb-5">Onboarding</h1>
                    <form autoComplete="false" className="flex flex-col gap-2" onSubmit={handleRegister}>
                        <label htmlFor="text">Username</label>
                        <input type="text" placeholder="Username" className=" bg-transparent border-2 border-white/20 p-2 focus:outline-none  rounded-lg text-white" onChange={(e) => setUserName(e.target.value)} />
                        <label htmlFor="Email">Email</label>
                        <input type="email" placeholder="Email" className=" bg-transparent border-2 border-white/20 p-2 focus:outline-none  rounded-lg text-white" onChange={(e) => setEmail(e.target.value)} />
                        <label htmlFor="text">Phonenumber</label>
                        <input type="text" placeholder="Enter Your Phone number" className=" bg-transparent border-2 border-white/20 p-2 focus:outline-none  rounded-lg text-white" onChange={(e) => setPhoneNumber(e.target.value)} />
                        <label htmlFor="Password">Password</label>
                        <div className={`flex justify-between items-center border-2 rounded-lg  ${passwordMismatch ? "border-red-500" : "border-white/20"} p-2 `}>
                            <input type={`${showPassword ? "text" : "password"}`} placeholder="Password should have alteast 8 characters" className="w-[90%] bg-transparent focus:outline-none " onChange={(e) => handlePasswordChange(e.target.value)} />
                            {showPassword ? <EyeOff onClick={() => setShowPassword(!showPassword)} /> : <Eye onClick={() => setShowPassword(!showPassword)} />}
                        </div>

                        <label htmlFor="password">Confirm Password</label>
                        <div className={`flex justify-between items-center border-2 rounded-lg  ${passwordMismatch ? "border-red-500" : "border-white/20"} p-2 `}>
                            <input type={`${showConfirmPassword ? "text" : "password"}`} placeholder="Password" className=" w-[90%] bg-transparent focus:outline-none" onChange={(e) => handleConfirmPasswordChange(e.target.value)} />
                            {showConfirmPassword ? <EyeOff onClick={() => setShowConfirmPassword(!showConfirmPassword)} /> : <Eye onClick={() => setShowConfirmPassword(!showConfirmPassword)} />}
                        </div>
                        {passwordMismatch && <span className="text-red-500 font-semibold">Password Didn&apos;t Match</span>}
                        {password && confirmPassword.length < 8 && <span className="text-red-500 font-semibold">Password should have alteast 8 characters</span>}
                        {loading ? (
                            <button className=" font-semibold flex gap-3 p-3  bg-white text-black rounded-lg items-center justify-center" disabled={true}>
                                <ClockLoader size={30} />
                                <span>Registering...</span>
                            </button>
                        ) : (
                            <button className={` p-3 ${userName && email && phoneNumber && password && confirmPassword != "" && password === confirmPassword ? "bg-blue-600 cursor-pointer" : "bg-white/30 text-black cursor-not-allowed"} rounded-lg mt-3 font-semibold duration-200 ${userName && email && password && confirmPassword != "" && password && confirmPassword.length > 8 && password && "hover:bg-white"} hover:text-black`} disabled={userName && email && password && confirmPassword != "" && password && confirmPassword.length > 8 && password ? false : true}>
                                Register
                            </button>
                        )}

                        <span className=" text-center mt-2">
                            Already have an account?{" "}
                            <Link href={"/login"} className=" text-blue-500 ">
                                Login
                            </Link>
                        </span>
                    </form>
                </div>
            </section>
        </>
    );
};

export default Page;
