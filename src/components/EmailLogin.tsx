import React, { useState } from "react";
import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

const EmailLogin = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmationPassword, setConfirmationPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [focus, setFocus] = useState<null | "email" | "name" | "password" | "confirmation-password">(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [register, setRegister] = useState<boolean>(false);
    let navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();
        if (register) {
            if (password === confirmationPassword) {
                try {
                    const login = await createUserWithEmailAndPassword(auth, email, password);
                    if (login) {
                        await updateProfile(login.user, { displayName: name });
                        setLoading(false);
                        setRegister(false);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        } else {
            try {
                const login = await signInWithEmailAndPassword(auth, email, password);
                if (login) {
                    setLoading(false);
                    navigate("/");
                }
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex flex-col h-screen justify-center container items-center mx-auto">
            {loading && <Loading/>}
            <p className="text-3xl my-3 font-medium w-full text-center">{register ? "Create account" : "Sign In"}</p>
            {!register && (
                <p className="text-sm my font-light w-full text-center">
                    Not registered yet?{" "}
                    <span onClick={() => setRegister(true)} className="cursor-pointer underline font-semibold">
                        Do it now
                    </span>
                </p>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col items-center w-1/2">
                <div className="flex flex-col items-center justify-center w-full mt-4">
                    <p className={`mb-2 text-xl  `}>E-mail:</p>
                    <input
                        type="email"
                        placeholder={focus === "email" ? "" : "E-mail"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocus("email")}
                        onBlur={() => setFocus(null)}
                        required
                        name="email"
                        className="w-5/6 border border-neutral-400 hover:shadow-md hover:shadow-neutral-400 bg-neutral-200 rounded-xl p-2 text-center mx-4 mb-4 focus:shadow-md focus:shadow-neutral-400 focus:outline-0"
                    />
                </div>
                {register && (
                    <div className="flex flex-col items-center justify-center w-full">
                        <p className={`mb-2 text-xl  `}>Name:</p>
                        <input
                            type="text"
                            placeholder={focus === "name" ? "" : "Name"}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onFocus={() => setFocus("name")}
                            onBlur={() => setFocus(null)}
                            required
                            name="name"
                            className="w-5/6 border border-neutral-400 hover:shadow-md hover:shadow-neutral-400 bg-neutral-200 rounded-xl p-2 text-center mx-4 mb-4 focus:shadow-md focus:shadow-neutral-400 focus:outline-0"
                        />
                    </div>
                )}
                <div className="flex flex-col items-center justify-center w-full">
                    <p className={`mb-2 text-xl  `}>Password:</p>
                    <input
                        type="password"
                        placeholder={focus === "password" ? "" : "Password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocus("password")}
                        onBlur={() => setFocus(null)}
                        required
                        name="password"
                        className="w-5/6 border border-neutral-400 hover:shadow-md hover:shadow-neutral-400 bg-neutral-200 rounded-xl p-2 text-center mx-4 mb-4 focus:shadow-md focus:shadow-neutral-400 focus:outline-0"
                    />
                </div>
                {register && (
                    <div className="flex flex-col items-center justify-center w-full">
                        <p className={`mb-2 text-xl  `}>Confirmation Password:</p>
                        <input
                            type="password"
                            placeholder={focus === "confirmation-password" ? "" : "Confirmation Password"}
                            value={confirmationPassword}
                            onChange={(e) => setConfirmationPassword(e.target.value)}
                            onFocus={() => setFocus("confirmation-password")}
                            onBlur={() => setFocus(null)}
                            required
                            name="confirmation-password"
                            className="w-5/6 border border-neutral-400 hover:shadow-md hover:shadow-neutral-400 bg-neutral-200 rounded-xl p-2 text-center mx-4 mb-4 focus:shadow-md focus:shadow-neutral-400 focus:outline-0"
                        />
                    </div>
                )}
                <button type="submit" className="w-32 p-2 m-3 border border-black rounded-xl hover:shadow-md hover:shadow-black">
                    {
                        <span>{register ? "Create" : "Sign In"}</span>
                    }
                </button>
            </form>
        </div>
    );
};

export default EmailLogin;
