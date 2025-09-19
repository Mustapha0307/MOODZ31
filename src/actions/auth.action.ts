"use server";

import {
  LoginSchema,
  OrderFormSchema,
  RegisterSchema,
} from "@/utils/validationSchemas";
import { prisma } from "@/utils/prisma";
import { signIn, signOut } from "@/auth";
import * as bcrypt from "bcryptjs";
import { z } from "zod";
import { AuthError } from "next-auth";
import { ActionType } from "@/utils/types";

// LoginAction

export const loginAction = async (
  data: z.infer<typeof LoginSchema>
): Promise<ActionType> => {
  const validation = LoginSchema.safeParse(data);
  if (!validation.success)
    return { success: false, message: "Invalid Credentials" };

  const { email, password } = validation.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.email || !user.password)
      return { success: false, message: "Invalid Credentials" };
    await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/profile/user",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, message: "Invalid email or password" };
        default:
          return { success: false, message: "Something went wrong" };
      }
    }
    throw error;
  }

  return { success: true, message: "Logged in successfully" };
};

// RegisterAction

export const RegisterAction = async (
  data: z.infer<typeof RegisterSchema>
): Promise<ActionType> => {
  const validation = RegisterSchema.safeParse(data);
  if (!validation.success)
    return { success: false, message: "Invalid Credentials" };

  const { name, password, email } = validation.data;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) return { success: false, message: "User already exist" };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });

    return { success: true, message: "Register Successfuly" };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong, please try again ",
    };
  }
};

export const ActiveAccountAction = async (userId: string): Promise<ActionType> => {
if (!userId) return { success: false, message: "Invalid user ID" };
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isTwoStepEnabled: true },
    });
    return { success: true, message: "Account activated successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
};

export const UnactiveAccountAction = async (userId: string): Promise<ActionType> => {
if (!userId) return { success: false, message: "Invalid user ID" };
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isTwoStepEnabled: false },
    });
    return { success: true, message: "Account activated successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
};
export const DeleteAccountAction = async (userId: string): Promise<ActionType> => {
if (!userId) return { success: false, message: "Invalid user ID" };
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    return { success: true, message: "Account Deleted Successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
};

// LogOut

export const logoutAction = async () => {
  await signOut();
};
