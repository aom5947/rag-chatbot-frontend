export const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="flex-1 border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-200 transition-all bg-white">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
            <Icon size={20} className="text-blue-700" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
);