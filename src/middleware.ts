import {
    convexAuthNextjsMiddleware,
    createRouteMatcher,
    nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isSignInPage = createRouteMatcher(["/login", "/signup"]);
const isPublicPage = createRouteMatcher(["/", "/login", "/signup", "/api/vapi/webhook", "/api/elevenlabs/tool"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
    const isAuth = await convexAuth.isAuthenticated();

    // If logged in and on landing page or auth page -> go to dashboard
    if ((isSignInPage(request) || request.nextUrl.pathname === "/") && isAuth) {
        return nextjsMiddlewareRedirect(request, "/dashboard");
    }

    // If not logged in and not public -> go to login
    if (!isPublicPage(request) && !isAuth) {
        return nextjsMiddlewareRedirect(request, "/login");
    }
});

export const config = {
    // The following matcher runs middleware on all routes
    // except static assets.
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
