import './App.css'

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center 
                    bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 
                    bg-[length:200%_200%] animate-gradient">

      <div className="relative bg-white/10 backdrop-blur-xl 
                      border border-white/20 
                      px-16 py-14 rounded-3xl 
                      shadow-[0_0_60px_rgba(255,255,255,0.3)] 
                      text-center transition-all duration-500 
                      hover:scale-105">

        <h1 className="text-6xl font-extrabold 
                       bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-300 
                       bg-clip-text text-transparent 
                       drop-shadow-2xl">
          🚀 Tailwind โหมดเทพ!
        </h1>

        <p className="mt-6 text-xl text-white/90">
          ตอนนี้เว็บของจิรายุระดับ Production แล้ว 🔥
        </p>

        <button className="mt-10 px-10 py-4 
                           bg-gradient-to-r from-yellow-400 to-orange-500 
                           text-white font-bold rounded-full 
                           shadow-lg hover:shadow-yellow-300/50 
                           hover:scale-110 
                           transition-all duration-300">
          ลองกดดู 😎
        </button>

      </div>

    </div>
  )
}

export default App