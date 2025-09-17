
"use client";
import { Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MicroHeader() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-700 ease-out rounded-2xl backdrop-blur-lg bg-white/10 shadow-lg
        ${isScrolled
                    ? 'w-[calc(100vw-2rem)] max-w-none'
                    : 'w-80'
                }
      `}
            style={{
                opacity: isScrolled ? 1 : 0.9
            }}
        >
            <div className={`flex items-center px-4 py-2 transition-all duration-700 ease-out
        ${isScrolled
                    ? 'justify-between'
                    : 'justify-center space-x-4'
                }
      `}>
                {/* Branding */}
                <div className={`flex items-center space-x-2 transition-all duration-700 ease-out
          ${isScrolled ? 'transform translate-x-0' : 'transform translate-x-0'}
        `}>
                    <Sun className="w-5 h-5 text-yellow-400 animate-pulse" />
                    <span className="text-white font-semibold text-sm sm:text-base">SolarCast</span>
                </div>

                {/* Product Hunt Badge */}
                <a
                    href="https://www.producthunt.com/products/solarcast?launch=solarcast"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-1 bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded-xl text-white text-xs sm:text-sm font-medium shadow-md transition-all duration-700 ease-out transform hover:scale-105
            ${isScrolled ? 'translate-x-0' : 'translate-x-0'}
          `}
                >
                    <span>🚀 Live on PH</span>
                    <span className="font-bold">▲</span>
                </a>
            </div>
        </div>
    );
}
