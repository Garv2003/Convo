import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Label,
    Input
} from "@/components/ui";
import { useRegister } from "@/hooks/useRegister";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/schema";
import { Link } from "react-router-dom";
import { z } from "zod";

export function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema)
    });

    const { registerUser, isPending } = useRegister();

    const handleRegister = handleSubmit(({ name, email, password, confirmPassword }) => {
        registerUser({ name, email, password, confirmPassword });
    });

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Card className="w-[400px]">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Create an account</CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" type="text" placeholder="John Doe" {...register("name")} />
                        {errors.name && <span className="text-red-500">{errors.name.message}</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
                        {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
                        {errors.password && <span className="text-red-500">{errors.password.message}</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input id="confirm-password" type="password" placeholder="••••••••" {...register("confirmPassword")} />
                        {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <div className="w-full flex items-center justify-start">
                        <span className="text-muted-foreground">Already have an account?</span>
                        <Link to="/login">
                            <Button variant="link">Login</Button>
                        </Link>
                    </div>
                    <Button className="w-full" onClick={handleRegister} disabled={isPending}>Create account</Button>
                </CardFooter>

            </Card>
        </div>
    )
}