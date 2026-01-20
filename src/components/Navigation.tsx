"use client";

import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useAlert } from "./AlertContext";
import { useAuthActions } from "@convex-dev/auth/react";

export function Navigation() {
    const pathname = usePathname();
    const user = useQuery(api.users.viewer);
    const updateUser = useMutation(api.users.updateUser);
    const triggerCall = useAction(api.vapi.triggerOutboundCall);
    const { showAlert } = useAlert();
    const { signOut } = useAuthActions();

    // Local state for the input to avoid jerky updates while typing
    const [phoneInput, setPhoneInput] = useState("");
    const [isCalling, setIsCalling] = useState(false);

    // Sync local state when user data loads
    useEffect(() => {
        if (user?.phone) {
            setPhoneInput(user.phone);
        }
    }, [user?.phone]);

    const handlePhoneBlur = async () => {
        if (user && phoneInput !== user.phone) {
            await updateUser({ phone: phoneInput });
        }
    };

    const handleCallMe = async () => {
        if (!user?.phone) {
            showAlert("Please enter a phone number first.", "Missing Information");
            return;
        }
        setIsCalling(true);
        try {
            await triggerCall({ phone: user.phone, type: "daily-agent" });
            showAlert("Call triggered! Check your phone.", "Success");
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.message || error.toString();
            const displayMessage = errorMessage.replace(/ServerError: /, "");
            showAlert(`Failed to trigger call: ${displayMessage}`, "Error");
        } finally {
            setIsCalling(false);
        }
    };

    // Hide navigation on login/signup pages or when user is not logged in
    const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/dash-2";

    // Still loading user data
    if (user === undefined) {
        return <div className="h-16 w-full border-b bg-background/95 backdrop-blur animate-pulse" />;
    }

    if (isAuthPage || user === null) {
        return null;
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center px-6 h-16 transition-all">
            <Link href="/" className="font-bold text-xl tracking-tight mr-8 flex items-center gap-2">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                    <Image src="/logo.svg" alt="AI Coach logo" fill className="object-cover" />
                </div>
                <span>Coach</span>
            </Link>

            <div className="flex items-center gap-6 text-sm font-medium mr-auto">
                <Link
                    href="/"
                    className={`transition-colors hover:text-foreground/80 ${pathname === "/" ? "text-foreground" : "text-foreground/60"}`}
                >
                    Dashboard
                </Link>
                <Link
                    href="/calls"
                    className={`transition-colors hover:text-foreground/80 ${pathname === "/calls" ? "text-foreground" : "text-foreground/60"}`}
                >
                    History
                </Link>
            </div>

            <div className="flex items-center gap-4 ml-auto">
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                        type="text"
                        placeholder="+1234567890"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        onBlur={handlePhoneBlur}
                        className="bg-muted text-foreground border rounded px-2 py-1 w-32 text-sm focus:outline-none focus:ring-1 focus:ring-primary hidden sm:block"
                    />
                    <Button
                        onClick={handleCallMe}
                        disabled={isCalling}
                        size="sm"
                        className={isCalling ? "opacity-50" : "bg-green-600 hover:bg-green-700 text-white"}
                    >
                        {isCalling ? "Calling..." : "📞 Call Me"}
                    </Button>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.image} alt={user?.name || "User"} />
                                <AvatarFallback>{user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <div className="flex items-center justify-start gap-2 p-2">
                            <div className="flex flex-col space-y-1 leading-none">
                                <p className="font-medium">{user?.name || "User"}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/settings">Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/debug">Debug</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut()}>
                            Log out
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <div className="p-2">
                            <ThemeToggle />
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
