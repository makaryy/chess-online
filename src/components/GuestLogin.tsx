import { signInAnonymously, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

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
            <p className="text-3xl my-3 font-medium">Type your name here</p>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    name="name"
                    className="w-96 border active:border-2 border-neutral-400  hover:border-black hover:shadow-md hover:shadow-black bg-neutral-200 rounded-xl p-2 text-center m-4"
                />
                <button type="submit" className="w-32 p-2 border border-black rounded-xl hover:shadow-md hover:shadow-black">
                    {loading ? <img src="/icons/spinner.svg" alt="Loading..." className="animate-spin w-4 h-4" /> : <span>Enter</span>}
                </button>
            </form>
        </div>
    );
};

export default GuestLogin;
