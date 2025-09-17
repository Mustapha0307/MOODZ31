import {z} from "zod"

export const LoginSchema = z.object({
    email: z.string().email({message: "Invalid email"}),
    password: z.string().min(6, {message: "Password must be at least 6 charachters long"}),
});

export const RegisterSchema = z.object({
    name: z.string({
        required_error:"Name is required",
        invalid_type_error:"Name must be of type string"
    }).min(2,{message:"Name mus be at least 2 charachters"}),
    email: z.string().email({message: "Invalid email"}),
   password: z.string().min(6, {message: "Password must be at least 6 charachters long"})
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email({message: "Invalid email"}),
});

export const ResetPasswordSchema = z.object({
    newPassword: z.string().min(6, {message: "Password must be at least 6 charachters long"})
});

export const OrderFormSchema = z.object({
    namePatient : z.string({
        required_error:"Name is required",
        invalid_type_error:"Name must be of type string"
    }).min(2,{message:"Name must be at least 2 charachters"}),
    agePatient: z.string(),
    typeOfRay: z.string().min(2,{message:"Type of ray must be at least 2 characters"}),
    statusP: z.enum(["Urgent", "Normal"], {
    required_error: "Please select a Status"
  }),

})

export const ValidOrderSchema = z.object({
    note: z.string().optional()
})

export const AddItemSchema = z.object({
    nama: z.string().min(2,{message: "Name must be at least 2 characters"}),
    categoryId: z.string().min(2,{message: "Please select a category"}),
    price: z.number().min(2,{message: "Price must be at least 2 characters"})
})
export const EditItemSchema = z.object({
    namaE: z.string().min(2,{message: "Name must be at least 2 characters"}),
    categoryIdE: z.string().min(2,{message: "Please select a category"}),
    priceE: z.number().min(2,{message: "Price must be at least 2 characters"})
})
