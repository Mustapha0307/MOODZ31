import type { NextAuthConfig } from "next-auth"
import { LoginSchema } from "./utils/validationSchemas";
import { prisma } from "./utils/prisma";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import * as bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
 
// Notice this is only an object, not a full Auth.js instance
export default {
   providers: [
        Credentials({
            async authorize(data){
                const validation = LoginSchema.safeParse(data);
                if(validation.success){
                    const { email, password } = validation.data
                    const user = await prisma.user.findUnique({where: {email}});
                    if(!user || !user.password) {
                        console.log("no user or password");
                        return null 
                    }
                    const isPasswordMatch = await bcrypt.compare(password, user.password)
                    if(isPasswordMatch) return user;
                    console.log("password no match");
                }else{
                    console.log("validation no success", validation.error);
                }
                return null
            }
        }),GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET
        }),Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET
        })
    ]
} satisfies NextAuthConfig