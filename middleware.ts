import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// const isPublicRoutes = createRouteMatcher(["/api/webhooks/clerk"]);

// const { userId } = auth();
// const currentUrl = new URL(req.url);
// console.log("userId", userId, currentUrl);

// if (!userId && isPublicRoutes(req)) {
//     return NextResponse.next(); // Allow public routes to pass through
// }
export default clerkMiddleware();

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ]
};

// return NextResponse.redirect(new URL("/home", req.url))