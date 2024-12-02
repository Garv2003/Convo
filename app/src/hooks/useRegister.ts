import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { registerSchema } from "@/schema";
import { registerAction } from "@/appwrite/actions";

export const useRegister = () => {
    const navigate = useNavigate();

    const { mutate: registerUser, isPending } = useMutation({
        mutationFn: async ({ name, email, password }: z.infer<typeof registerSchema>) => {
            return await registerAction(email, password, name);
        },
        onSuccess: () => {
            toast.success("Account created successfully!", {
                description: "You can now log in"
            });
            navigate("/login");
        },
        onError: (error) => {
            console.error('Registration error:', error);
            toast.error("Account creation failed!", {
                description: "Please try again"
            });
        }
    });

    return {
        registerUser,
        isPending
    };
};