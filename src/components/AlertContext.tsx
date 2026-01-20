"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { AlertModal } from "@/components/ui/AlertModal";

interface AlertContextType {
    showAlert: (message: string, title?: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("Notification");

    const showAlert = (newMessage: string, newTitle: string = "Notification") => {
        setMessage(newMessage);
        setTitle(newTitle);
        setIsOpen(true);
    };

    const closeAlert = () => setIsOpen(false);

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <AlertModal
                isOpen={isOpen}
                onClose={closeAlert}
                title={title}
                message={message}
            />
        </AlertContext.Provider>
    );
}

export function useAlert() {
    const context = useContext(AlertContext);
    if (context === undefined) {
        throw new Error("useAlert must be used within an AlertProvider");
    }
    return context;
}
