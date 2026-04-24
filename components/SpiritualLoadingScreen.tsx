'use client';

interface SpiritualLoadingScreenProps {
  message?: string;
}

export default function SpiritualLoadingScreen({ message = "Seeking the light..." }: SpiritualLoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-black/95 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Light */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-yellow-300 to-white animate-pulse shadow-[0_0_50px_rgba(255,255,255,0.8)]">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-white to-yellow-200 animate-spin shadow-inner"></div>
          </div>
          {/* Radiating Light Effect */}
          <div className="absolute inset-0 w-32 h-32 -m-4 rounded-full bg-gradient-radial from-white/20 via-yellow-300/10 to-transparent animate-ping"></div>
        </div>

        {/* Loading Message */}
        <h3 className="text-2xl font-bold text-yellow-300 mb-2 animate-pulse">
          {message}
        </h3>
        
        {/* Spiritual Quote */}
        <p className="text-yellow-100 italic max-w-md mx-auto leading-relaxed">
          "Thy word is a lamp unto my feet, and a light unto my path."
        </p>
        <p className="text-yellow-200/60 text-sm mt-1">— Psalm 119:105</p>

        {/* Animated Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          <div className="w-2 h-2 bg-yellow-300 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-yellow-300 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-yellow-300 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
}