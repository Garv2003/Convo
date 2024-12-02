import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Input,
    Label
} from "@/components/ui";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schema";
import { useLogin } from "@/hooks/useLogin";
import { z } from "zod";

export function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema)
    });

    const { login, isPending } = useLogin();

    const handleLogin = handleSubmit(({ email, password }) => {
        login({ email, password });
    });

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Card className="w-[400px]">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email and password to login
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
                        {errors.email && <span className="text-red-700">{errors.email.message}</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
                        {errors.password && <span className="text-red-700">{errors.password.message}</span>}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <div className="w-full flex items-center justify-start space-x-2">
                        <span className="text-muted-foreground">
                            Don't have an account?
                        </span>
                        <Link
                            to="/register"
                            className="text-primary underline-offset-4 hover:underline"
                        >
                            Register
                        </Link>
                    </div>
                    <Button className="w-full"
                        onClick={handleLogin}
                        disabled={isPending}
                    >
                        Login
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}