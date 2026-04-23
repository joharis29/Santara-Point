"use client";
import React, { useState, useEffect } from 'react';

/**
 * BackgroundSlider Component
 * Cycles through an array of images with a smooth sliding/fading transition.
 */
export default function BackgroundSlider({ images, interval = 8000 }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!images || images.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, interval);

        return () => clearInterval(timer);
    }, [images, interval]);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 bg-cover bg-center transition-all duration-[3000ms] ease-in-out transform ${
                        index === currentIndex 
                        ? 'opacity-100 scale-100 translate-x-0 rotate-0' 
                        : 'opacity-0 scale-110 translate-x-8 -rotate-1'
                    }`}
                    style={{
                        backgroundImage: `url('${image}')`,
                        zIndex: index === currentIndex ? 1 : 0
                    }}
                />
            ))}
            
            {/* Dark Gradient Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/40 z-10"></div>
            
            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay z-10 pointer-events-none"></div>
        </div>
    );
}

