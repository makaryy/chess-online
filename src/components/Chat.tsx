import { collection, doc, getDocs, query, setDoc, updateDoc, where, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "../firebase/firebase";
import { RootState } from "../redux/store";
import { v4 as uuidv4 } from "uuid";
import { setChat } from "../redux/chat";

const Chat = () => {
    const [user] = useAuthState(auth);
    const [message, setMessage] = useState("");
    const chat = useSelector((state: RootState) => state.chat);
    const game = useSelector((state: RootState) => state.game);
    const dispatch = useDispatch();
    useEffect(() => {
        const initChat = async () => {
            const member = game.members.find((m) => m.uid === user?.uid);
            if (member?.creator) {
                const tempChat = {
                    gameId: game.id,
                    id: uuidv4(),
                    messages: []
                };
                await setDoc(doc(db, "chats", tempChat.id), tempChat);
                dispatch(setChat(tempChat));
            } else {
                const q = query(collection(db, "chats"), where("gameId", "==", game.id));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(async (doc) => {
                    const chatData = await doc.data();
                    const tempChat = {
                        gameId: chatData.gameId,
                        id: chatData.id,
                        messages: chatData.messages
                    };
                    dispatch(setChat(tempChat));
                });
            }
        };
        initChat();
    }, []);

    useEffect(() => {
        if (chat.id) {
            onSnapshot(doc(db, "chats", chat.id), async (data) => {
                const newChat = await data.data();
                dispatch(setChat({ ...chat, messages: newChat?.messages }));
            });
        }
    }, [chat.id]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (user) {
            const updatedMessages = [
                ...chat.messages,
                {
                    msg: message,
                    img: user.photoURL ? user.photoURL : "/icons/user-icon.svg",
                    user: { uid: user.uid, displayName: user.displayName },
                    createdAt: JSON.stringify(new Date())
                }
            ];
            setMessage("");
            dispatch(setChat({ ...chat, messages: updatedMessages }));
            if (chat.id) await updateDoc(doc(db, "chats", chat.id), { messages: updatedMessages });
        }
    };
    return (
        <div className="bg-neutral-800 w-2/5 h-screen flex flex-col-reverse">
            <div className="flex flex-row w-full">
                <form className="w-full" onSubmit={(e) => sendMessage(e)}>
                    <input
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        name="message"
                        autoComplete="off"
                        className="w-4/5 border border-neutral-400 bg-neutral-300 rounded-xl rounded-r-none p-2 text-center mb-1 focus:bg-neutral-200 focus:outline-0"
                    />
                    <button type="submit" className="w-1/5 text-white rounded-xl border border-white border-l-0 p-2 rounded-l-none">
                        Send
                    </button>
                </form>
            </div>
            <div className="h-max-content max-h-screen flex flex-col justify-center p-2 text-white font-light">
                {chat &&
                    chat.messages.map((m, i) => {
                        const player = m.user?.uid === user?.uid ? true : false;
                        return (
                            <div className={player ? "flex flex-row-reverse w-full mx-auto my-1" : "flex flex-row w-full mx-auto my-1"} key={i}>
                                <img src={m.img} alt="" className="w-6 h-6 rounded-full mx-3" />
                                <span className={player ? "bg-blue-500 rounded-2xl px-2" : "bg-red-500 rounded-2xl px-2"}>{m.msg}</span>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default Chat;
