const Footer = () => {
    return (
        <footer className="border-t border-gray-200 bg-white">
            <div className="mx-auto max-w-[1024px] w-full px-4 py-6 text-center text-xs text-gray-400 leading-relaxed">
                <p>
                    ข้อมูลที่ได้รับจากระบบนี้เป็นเพียงข้อมูลเบื้องต้นเพื่อการศึกษาเท่านั้น{" "}
                    <strong className="text-gray-500">ไม่ถือเป็นคำปรึกษาทางกฎหมาย</strong>{" "}กรุณาปรึกษาทนายความหรือเจ้าหน้าที่ผู้มีอำนาจก่อนตัดสินใจ
                </p>
                <p className="mt-2">© {new Date().getFullYear()} TrafficLawAI · สงวนลิขสิทธิ์</p>
            </div>
        </footer>
    )
}
export default Footer;