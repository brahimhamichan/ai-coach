import { Password } from "@convex-dev/auth/providers/Password";
import Resend from "@auth/core/providers/resend";
import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } =
    convexAuth({
        providers: [
            Password({
                profile(params) {
                    return {
                        email: params.email as string,
                        name: params.name as string,
                    };
                },
                validatePasswordRequirements: (password: string) => {
                    if (password.length < 4) {
                        throw new Error("Password must be at least 4 characters long");
                    }
                },
            }),
            Resend({
                apiKey: process.env.AUTH_RESEND_KEY,
                from: "AI Coach <onboarding@resend.dev>",
                generateVerificationToken: () => {
                    return Math.floor(100000 + Math.random() * 900000).toString();
                },
            }),
            Google,
        ],
    });
