import { useNavigate } from "react-router-dom";

interface AlertProps {
    alert: string | null;
}

const Alert = ({ alert }: AlertProps) => {
    const navigate = useNavigate();
    return (
        <div className="h-[450px] shadow-alert w-full bg-opacity-80 bg-neutral-900 fixed left-0 z-50 flex justify-around items-center text-2xl text-white flex-col">
            <div className="font-normal text-4xl">{alert}</div>
            <button
                className="hover:bg-neutral-300 hover:text-black p-4 rounded-xl"
                onClick={() => {
                    navigate("/");
                }}>
                RETURN TO MAIN PAGE
            </button>
        </div>
    );
};

export default Alert;
