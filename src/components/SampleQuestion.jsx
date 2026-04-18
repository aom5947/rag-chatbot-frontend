import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const SampleQuestion = ({ text }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleClick = () => {
        if (!user) {
            navigate("/register");
        } else {
            navigate(`/chat?q=${encodeURIComponent(text)}`);
        }
    };

    return (
        <button
            onClick={handleClick}
            className="inline-block px-4 py-2 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-300 text-sm text-gray-700 rounded-full transition-colors cursor-pointer"
        >
            {text}
        </button>
    );
};