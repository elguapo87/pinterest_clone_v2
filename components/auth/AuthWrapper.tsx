"use client"

import ImageKitWrapper from "@/components/ImageKitWrapper"
import { AuthContext } from "@/context/AuthContext"
import { useContext, useState } from "react"
import GuestGuard from "./GuestGuard"

const AuthWrapper = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("AuthWrapper must be within AuthContextProvider");
    const { register, login, authLoading } = authContext;

    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isRegister, setIsRegister] = useState(false);

    const handleRegister = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        await register({ username, displayName, email, password });
    };

    const handleLogin = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        await login({ email, password });
    };

    return (
        <GuestGuard>
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
                        <form onSubmit={handleRegister} className="w-full flex flex-col gap-4" key="registerForm">
                            {/* FORM GROUP */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px]" htmlFor="username">Username</label>
                                <input
                                    onChange={(e) => setUsername(e.target.value)}
                                    value={username}
                                    className="p-3 border-2 border-[#e0e0e0] rounded-2xl"
                                    type="text"
                                    placeholder="Username"
                                    required
                                />
                            </div>
                            {/* FORM GROUP */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px]" htmlFor="name">Name</label>
                                <input
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    value={displayName}
                                    className="p-3 border-2 border-[#e0e0e0] rounded-2xl"
                                    type="name"
                                    placeholder="Name"
                                    required
                                />
                            </div>
                            {/* FORM GROUP */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px]" htmlFor="email">Email</label>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    className="p-3 border-2 border-[#e0e0e0] rounded-2xl"
                                    type="email"
                                    placeholder="Email"
                                    required
                                />
                            </div>
                            {/* FORM GROUP */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px]" htmlFor="">Password</label>
                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    className="p-3 border-2 border-[#e0e0e0] rounded-2xl"
                                    type="password"
                                    placeholder="Password"
                                    required
                                />
                            </div>

                            <button
                                className="bg-[#e50829] p-3 border-none rounded-4xl text-white
                                cursor-pointer font-bold"
                                type="submit"
                                disabled={authLoading}
                            >
                                {authLoading ? "Loading..." : "Register"}
                            </button>
                            <p onClick={() => setIsRegister(false)} className="text-[14px] text-center cursor-pointer">
                                Do you have an account? <b>Login</b>
                            </p>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4" key="loginForm">
                            {/* FORM GROUP */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px]" htmlFor="email">Email</label>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    className="p-3 border-2 border-[#e0e0e0] rounded-2xl"
                                    type="email"
                                    placeholder="Email"
                                    required
                                />
                            </div>
                            {/* FORM GROUP */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px]" htmlFor="password">Password</label>
                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    className="p-3 border-2 border-[#e0e0e0] rounded-2xl"
                                    type="password"
                                    placeholder="Password"
                                    required
                                />
                            </div>

                            <button
                                className="bg-[#e50829] p-3 border-none rounded-4xl text-white
                                cursor-pointer font-bold"
                                type="submit"
                                disabled={authLoading}
                            >
                                {authLoading ? "Loading..." : "Login"}
                            </button>
                            <p onClick={() => setIsRegister(true)} className="text-[14px] text-center cursor-pointer">
                                Don&apos;t have an account? <b>Register</b>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </GuestGuard>
    )
}

export default AuthWrapper
