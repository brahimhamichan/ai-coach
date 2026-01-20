"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

export function AlertModal({ isOpen, onClose, title, message }: AlertModalProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            // Small delay to allow mount before animating in
            requestAnimationFrame(() => setIsAnimating(true));
        } else {
            setIsAnimating(false);
            // Wait for animation to finish before unmounting
            const timer = setTimeout(() => setIsMounted(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isMounted) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300 ease-out ${isAnimating ? "bg-black/60 backdrop-blur-sm opacity-100" : "bg-black/0 opacity-0"
                }`}
            onClick={onClose}
        >
            <div
                className={`relative w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card p-6 shadow-2xl transition-all duration-300 ease-out ${isAnimating
                    ? "scale-100 opacity-100 translate-y-0"
                    : "scale-95 opacity-0 translate-y-4"
                    }`}
                onClick={(e) => e.stopPropagation()}
                style={{
                    boxShadow: "0 0 40px -10px rgba(0, 0, 0, 0.5), 0 0 20px -15px rgba(255, 255, 255, 0.1)",
                }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground opacity-70 transition-opacity hover:bg-accent hover:text-accent-foreground hover:opacity-100"
                >
                    <X className="h-4 w-4" />
                </button>

                {/* Content */}
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                        {/* Dynamic Icon based on title/type could go here. Defaulting to Bell/Info generic look. */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-8 w-8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                            />
                        </svg>
                    </div>

                    <h2 className="mb-2 text-xl font-semibold text-card-foreground tracking-tight">
                        {title}
                    </h2>
                    <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                        {message}
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] hover:bg-primary/90 active:scale-95"
                    >
                        Okay
                    </button>
                </div>
            </div>
        </div>
    );
}
