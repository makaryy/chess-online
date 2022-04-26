import { doc, setDoc, updateDoc, onSnapshot, getDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "../firebase/firebase";
import { RootState } from "../redux/store";
import { setChat } from "../redux/chat";

const Chat = () => {
    const [user] = useAuthState(auth);
    const [message, setMessage] = useState("");
    const scrollRef = useRef<null | HTMLDivElement>(null);
    const chat = useSelector((state: RootState) => state.chat);
    const game = useSelector((state: RootState) => state.game);
    const dispatch = useDispatch();

    const initChat = async () => {
        const member = game.members.find((m) => m.uid === user?.uid);
        if (member && member.creator) {
            const tempChat = {
                gameId: game.id,
                id: game.chatId,
                messages: []
            };
            await setDoc(doc(db, "chats", game.chatId), tempChat);
            dispatch(setChat(tempChat));
        } else {
            const documentSnapshot = await getDoc(doc(db, "chats", game.chatId));

            const chatData = documentSnapshot.data();
            if (chatData) {
                const tempChat = {
                    gameId: chatData.gameId,
                    id: chatData.id,
                    messages: chatData.messages
                };
                dispatch(setChat(tempChat));
            }
        }
    };

    useEffect(() => {
        initChat();
    }, []);

    useEffect(() => {
        if (chat.id && chat.id === game.chatId) {
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
                    img: user.photoURL ? user.photoURL : "/icons/circle-user.svg",
                    user: { uid: user.uid, displayName: user.displayName },
                    createdAt: JSON.stringify(new Date())
                }
            ];
            setMessage("");
            dispatch(setChat({ ...chat, messages: updatedMessages }));
            if (scrollRef && scrollRef.current) scrollRef.current.scrollIntoView();
            chat.id && (await updateDoc(doc(db, "chats", chat.id), { messages: updatedMessages }));
        }
    };
    return (
        <div className="bg-neutral-700 lg:w-2/5 w-full lg:h-screen h-96 flex flex-col-reverse max-h-screen overflow-y-scroll scroll-smooth">
            <div ref={scrollRef} />
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
            <div className="h-full max-h-full flex flex-col justify-end p-2 text-white font-light ">
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
