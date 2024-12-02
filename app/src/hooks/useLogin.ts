import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { loginAction } from "@/appwrite/actions"
import { loginSchema } from "@/schema";

export const useLogin = () => {
    const navigate = useNavigate();

    const { mutate: login, isPending } = useMutation({
        mutationFn: async ({ email, password }: z.infer<typeof loginSchema>) => {
            await loginAction(email, password);
        },
        onSuccess: () => {
            toast.success("Login successful!", {
                description: "You are now logged in."
            });
            navigate("/");
        },
        onError: () => {
            toast.error("Invalid email or password", {
                description: "Please try again"
            });
        }
    });

    return {
        login,
        isPending
    };
};