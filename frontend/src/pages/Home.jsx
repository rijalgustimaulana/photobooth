import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden
      bg-gradient-to-b from-blue-300 to-white">

      {/* ✨ Y2K SPARKLES DECO — HEAVY MODE */}
      <Deco />

      {/* MAIN BUBBLE */}
      <div className="
        px-14 py-8 rounded-full shadow-2xl
        bg-gradient-to-r from-pink-300 to-pink-200 border-[6px] border-green-400
        flex flex-col items-center justify-center z-10
      ">
        
        {/* Tahun */}
        <div className="bg-yellow-300 text-gray-800 px-5 py-1 rounded-full text-md font-semibold mb-2">
          ✦2025✦
        </div>

        {/* Text Portfolio */}
       <h1
  className="text-6xl font-extrabold text-green-500"
  style={{
    textShadow: `
        -4px 4px 0 #00AEEF,
        -8px 8px 0 #0077cc
      `
  }}
>
  Nerd Photobooth
</h1>


        {/* Username */}
        <p className="mt-4 bg-green-200 px-5 py-1 rounded-full text-gray-800 font-italic text-lg"
        style={{fontFamily: "monospace",
         letterSpacing: "4x",
         textShadow: `
          2px 2px 0 #ffffff,
          4px 4px 0 #00AEEF
         `}}>
          by rijalgustimaulana
        </p>
        <Link 
  to="/login"
  className="
    mt-6 px-10 py-3 rounded-full 
    bg-yellow-300 hover:bg-green-200
    text-white font-extrabold text-lg 
    transition-shadow shadow-lg hover:shadow-xl
    inline-block
  "
  style={{
    textShadow:`2px 2px 0 #0077cc ,
                4px 4px 0 #ffffff`
  }}
>
  START
</Link>

      </div>
    </div>
  );
}

/* 🎀 DECO COMPONENT — Y2K STARS, DOTS, SPARKLES */
function Deco() {
  const items = [
    { char: "✦", size: "text-4xl", color: "text-yellow-300", x: "top-10 left-16" },
    { char: "✧", size: "text-5xl", color: "text-pink-400", x: "top-28 right-20" },
    { char: "✦", size: "text-3xl", color: "text-green-400", x: "bottom-20 left-28" },
    { char: "✸", size: "text-5xl", color: "text-blue-500", x: "bottom-32 right-10" },
    { char: "✷", size: "text-4xl", color: "text-purple-400", x: "top-16 right-40" },
    { char: "✦", size: "text-6xl", color: "text-blue-300", x: "bottom-10 right-1/3" },
    { char: "✷", size: "text-4xl", color: "text-purple-400", x: "top-16 right-40" },
    { char: "✷", size: "text-4xl", color: "text-green-500", x: "top-1/3 left-6" },
    { char: "✧", size: "text-5xl", color: "text-green-500", x: "bottom-1/4 right-1/4" },
    { char: "✧", size: "text-4xl", color: "text-yellow-400", x: "top-1/9 right-1/2" },
    { char: "✦", size: "text-3xl", color: "text-blue-600", x: "bottom-1/9 left-1/2" },
  ];

  return (
    <>
      {items.map((i, idx) => (
        <div
          key={idx}
          className={`absolute ${i.x} ${i.size} ${i.color} opacity-80 pointer-events-none select-none`}
        >
          {i.char}
        </div>
      ))}
    </>
  );
}
