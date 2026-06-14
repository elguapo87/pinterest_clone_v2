"use client"

import ImageKitWrapper from "@/components/ImageKitWrapper"
import { useState } from "react"

const Auth = () => {

    const [isRegister, setIsRegister] = useState(false);
   
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            {/* AUTH CONTAINER */}
            <div
                className="flex flex-col items-center justify-center gap-8 p-8 rounded-4xl
                    shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]"
            >
                <ImageKitWrapper
                    src="/general/logo.png"
                    alt="Logo"
                    width={36}
                    height={36}
                    imgWidth={36}
                    className="size-9"
                />
                <h1 className="font-normal">
                    {isRegister ? (
                        "Create an Account"
                    ) : (
                        "Login to your account"
                    )}
                </h1>

                {isRegister ? (
                    <form className="w-full flex flex-col gap-4" key="registerForm">
                        {/* FORM GROUP */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px]" htmlFor="username">Username</label>
                            <input
                                className="p-3 border-2 border-[#e0e0e0] rounded-2xl"
                                type="text"
                                placeholder="Username"
                                required
                                name="username"
                                id="username"
                            />
                        </div>
                        {/* FORM GROUP */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px]" htmlFor="name">Name</label>
                            <input
                                className="p-3 border-2 border-[#e0e0e0] rounded-2xl"
                                type="name"
                                placeholder="Name"
                                required
                                name="name"
                                id="name"
                            />
                        </div>
                        {/* FORM GROUP */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px]" htmlFor="email">Email</label>
                            <input
                                className="p-3 border-2 border-[#e0e0e0] rounded-2xl"
                                type="email"
                                placeholder="Email"
                                required
                                name="email"
                                id="email"
                            />
                        </div>
                        {/* FORM GROUP */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px]" htmlFor="">Password</label>
                            <input
                                className="p-3 border-2 border-[#e0e0e0] rounded-2xl"
                                type="password"
                                placeholder="Password"
                                required
                                name="password"
                                id="password"
                            />
                        </div>

                        <button
                            className="bg-[#e50829] p-3 border-none rounded-4xl text-white
                                cursor-pointer font-bold"
                            type="submit"
                        >
                            Register
                        </button>
                        <p onClick={() => setIsRegister(false)} className="text-[14px] text-center cursor-pointer">
                            Do you have an account? <b>Login</b>
                        </p>
                    </form>
                ) : (
                    <form className="w-full flex flex-col gap-4" key="loginForm">
                        {/* FORM GROUP */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px]" htmlFor="email">Email</label>
                            <input
                                className="p-3 border-2 border-[#e0e0e0] rounded-2xl"
                                type="email"
                                placeholder="Email"
                                required
                                name="email"
                                id="email"
                            />
                        </div>
                        {/* FORM GROUP */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[14px]" htmlFor="password">Password</label>
                            <input
                                className="p-3 border-2 border-[#e0e0e0] rounded-2xl"
                                type="password"
                                placeholder="Password"
                                required
                                name="password"
                                id="password"
                            />
                        </div>

                        <button
                            className="bg-[#e50829] p-3 border-none rounded-4xl text-white
                                cursor-pointer font-bold"
                            type="submit"
                        >
                            Login
                        </button>
                        <p onClick={() => setIsRegister(true)} className="text-[14px] text-center cursor-pointer">
                            Don&apos;t have an account? <b>Register</b>
                        </p>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Auth
