import { createUser, deleteUser, updateUser } from "@/lib/actions/userAction";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(req: Request) {
    console.log("Received a webhook request"); // Log when the request is received

    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error(
            "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
        );
    }

    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        console.log("Missing Svix headers", { svix_id, svix_timestamp, svix_signature }); // Log missing headers
        return new Response("Error occured -- no svix headers", {
            status: 400,
        });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
        console.log("Webhook verified successfully:", evt); // Log successful verification
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error occurred", {
            status: 400,
        });
    }

    const { id } = evt.data;
    const eventType = evt.type;

    // CREATE
    if (eventType === "user.created") {
        console.log("Creating a new user"); // Log user creation process
        const { id, email_addresses, image_url, first_name = "", last_name = "", username } = evt.data;

        const user = {
            clerkId: id,
            email: email_addresses[0].email_address,
            username: username!,
            firstName: first_name,
            lastName: last_name,
            photo: image_url,
        };

        const newUser = await createUser(user);

        if (newUser) {
            console.log("New user created:", newUser); // Log the new user details
            await clerkClient.users.updateUserMetadata(id, {
                publicMetadata: {
                    userId: newUser._id,
                },
            });
        }

        return NextResponse.json({ message: "OK", user: newUser });
    }

    // UPDATE
    if (eventType === "user.updated") {
        console.log("Updating user"); // Log user update process
        const { id, image_url, first_name = "", last_name = "", username } = evt.data;

        const user = {
            firstName: first_name,
            lastName: last_name,
            username: username!,
            photo: image_url,
        };

        const updatedUser = await updateUser(id, user);
        console.log("User updated:", updatedUser); // Log the updated user details

        return NextResponse.json({ message: "OK", user: updatedUser });
    }

    // DELETE
    if (eventType === "user.deleted") {
        console.log("Deleting user"); // Log user deletion process
        const { id } = evt.data;

        const deletedUser = await deleteUser(id!);
        console.log("User deleted:", deletedUser); // Log the deleted user details

        return NextResponse.json({ message: "OK", user: deletedUser });
    }

    console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
    console.log("Webhook body:", body);

    return new Response("", { status: 200 });
}
