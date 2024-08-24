"use server";

import { revalidatePath } from "next/cache";
import { handleError } from "../utils";
import User from "../models/userModel";
import { connectDB } from "../mongoose";

type CreateUserParams = {
    clerkId: string;
    email: string;
    username: string;
    firstName: string | null;
    lastName: string | null;
    photo: string;
};

type UpdateUserParams = {
    firstName: string | null;
    lastName: string | null;
    username: string;
    photo: string;
}


// CREATE
export async function createUser(user: CreateUserParams) {
    try {
        console.log("Missing connection above")
        await connectDB();
        console.log("Missing connection")

        // Check if firstName and lastName are empty strings, and if so, set them to null
        const newUserParams = {
            ...user,
            firstName: user.firstName === "" ? null : user.firstName,
            lastName: user.lastName === "" ? null : user.lastName,
        };

        const existingUser = await User.findOne({ username: user.username });
        if (existingUser) {
            throw new Error(`User with username ${user.username} already exists.`);
        }

        const newUser = await User.create(newUserParams);

        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        handleError(error);
    }
}

// READ
export async function getUserById(userId: string) {
    try {
        await connectDB();

        const user = await User.findOne({ clerkId: userId });

        if (!user) throw new Error("User not found");

        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        handleError(error);
    }
}

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
    try {
        await connectDB();

        const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
            new: true,
        });

        if (!updatedUser) throw new Error("User update failed");

        return JSON.parse(JSON.stringify(updatedUser));
    } catch (error) {
        handleError(error);
    }
}

// DELETE
export async function deleteUser(clerkId: string) {
    try {
        await connectDB();

        // Find user to delete
        const userToDelete = await User.findOne({ clerkId });

        if (!userToDelete) {
            throw new Error("User not found");
        }

        // Delete user
        const deletedUser = await User.findByIdAndDelete(userToDelete._id);
        revalidatePath("/");

        return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
    } catch (error) {
        handleError(error);
    }
}

// USE CREDITS
export async function updateCredits(userId: string, creditFee: number) {
    try {
        await connectDB();

        const updatedUserCredits = await User.findOneAndUpdate(
            { _id: userId },
            { $inc: { creditBalance: creditFee } },
            { new: true }
        )

        if (!updatedUserCredits) throw new Error("User credits update failed");

        return JSON.parse(JSON.stringify(updatedUserCredits));
    } catch (error) {
        handleError(error);
    }
}