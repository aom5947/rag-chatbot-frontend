import { Link } from "react-router-dom";

export const SampleQuestion = ({ text }) => (
    <Link
        to={`/chat?q=${encodeURIComponent(text)}`}
        className="inline-block px-4 py-2 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-300 text-sm text-gray-700 rounded-full transition-colors cursor-pointer"
    >
        {text}
    </Link>
);