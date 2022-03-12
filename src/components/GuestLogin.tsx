import { signInAnonymously, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

const GuestLogin = () => {
    const [name, setName] = useState<string>("");
    let navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();
        const login = await signInAnonymously(auth);
        await updateProfile(login.user, { displayName: name });
        if (login) {
            setLoading(false);
            navigate("/");
        }
    };
    return (
        <div className="flex flex-col h-screen justify-center container items-center mx-auto">
            {loading && <Loading/>}
            <p className="text-3xl my-3 font-medium">Type your name here</p>
            <form onSubmit={handleSubmit} className="flex flex-col items-center w-1/2">
                <div className="flex flex-col items-center justify-center w-full mt-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        name="name"
                        className="w-5/6 border border-neutral-400 hover:shadow-md hover:shadow-neutral-400 focus:shadow-md focus:shadow-neutral-400 focus:outline-0 bg-neutral-200 rounded-xl p-2 text-center mx-4 mb-4 "
                    />
                </div>
                <button type="submit" className="w-32 p-2 m-3 border border-black rounded-xl hover:shadow-md hover:shadow-black">
                    Enter
                </button>
            </form>
        </div>
    );
};

export default GuestLogin;
