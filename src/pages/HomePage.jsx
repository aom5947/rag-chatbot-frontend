import { Link } from "react-router-dom";
import { FeatureCard } from "../components/FeatureCard";
import { SampleQuestion } from "../components/SampleQuestion";
import { features, sampleQuestions } from "../data/data";
import { TypeAnimation } from "react-type-animation";
import { Navbar } from "../components/layout/Navbar";

const HomePage = () => {
    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <section className="mx-auto max-w-[1024px] w-full px-4 py-20 text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                    AI ช่วยคุณ{" "}
                    <span className="text-blue-700">
                        <TypeAnimation
                            sequence={[
                                'อ้างอิงมาตรากฎหมายได้ทันที',
                                1500,
                                'ตอบคำถามจราจรแบบเรียลไทม์',
                                1500,
                                'เข้าใจภาษาคน ไม่ต้องรู้มาตรา',
                                1500,
                            ]}
                            speed={50}
                            repeat={Infinity}
                        />
                    </span>
                </h1>

                <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                    Chatbot ตอบคำถามกฎหมายจราจรโดยใช้ RAG ค้นหา วิเคราะห์ และอธิบายกฎหมายได้ทันที
                </p>

                {/* CTA Buttons */}
                <div className="flex justify-center gap-3 flex-wrap">
                    <Link
                        to="/chat"
                        className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors shadow-sm"
                    >
                        เริ่มถามเลย
                    </Link>
                    <Link
                        to="/about"
                        className="px-6 py-3 border border-gray-300 hover:border-blue-700 hover:text-blue-700 text-gray-700 font-semibold rounded-lg transition-colors"
                    >
                        เรียนรู้เพิ่มเติม
                    </Link>
                </div>
            </section>

            {/* Feature Cards */}
            <section className="mx-auto max-w-[1024px] w-full px-4 pb-16">
                <div className="flex flex-col sm:flex-row gap-4">
                    {features.map((feature) => (
                        <FeatureCard key={feature.title} {...feature} />
                    ))}
                </div>
            </section>

            {/* Sample Questions */}
            <section className="mx-auto max-w-[1024px] w-full px-4 pb-20">
                <h2 className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                    ลองถามได้เลย
                </h2>
                <div className="flex flex-wrap justify-center gap-2">
                    {sampleQuestions.map((q) => (
                        <SampleQuestion key={q} text={q} />
                    ))}
                </div>
            </section>

            {/* Footer / Disclaimer */}
            <footer className="border-t border-gray-200 bg-white">
                <div className="mx-auto max-w-[1024px] w-full px-4 py-6 text-center text-xs text-gray-400 leading-relaxed">
                    <p>
                        <strong className="text-gray-500">ข้อสงวนสิทธิ์ทางกฎหมาย:</strong>{" "}
                        ข้อมูลที่ได้รับจากระบบนี้เป็นเพียงข้อมูลเบื้องต้นเพื่อการศึกษาเท่านั้น
                        ไม่ถือเป็นคำปรึกษาทางกฎหมาย กรุณาปรึกษาทนายความหรือเจ้าหน้าที่ผู้มีอำนาจก่อนตัดสินใจ
                    </p>
                    <p className="mt-2">© {new Date().getFullYear()} TrafficLawAI · สงวนลิขสิทธิ์</p>
                </div>
            </footer>
        </main>
    );
};

export default HomePage;