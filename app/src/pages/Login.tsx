import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { Query } from "appwrite"
import { account, databases, COLLECTION_ID_USERS, DATABASE_ID } from "../appwrite/config"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"

export function Login() {
    const navigate = useNavigate()

    const loginSchema = z.object({
        email: z.string().email("Invalid email"),
        password: z.string().min(6, "Password must be at least 6 characters")
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema)
    })

    const { mutate: login, isPending } = useMutation({
        mutationFn: async ({ email, password }: z.infer<typeof loginSchema>) => {
            await account.createEmailPasswordSession(email, password)
            const currentUser = await account.get()
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID_USERS,
                currentUser.$id,
                {
                    status: 'online',
                    lastSeen: new Date().toISOString(),
                    lastPing: new Date().toISOString(),
                }
            )
        },
        onSuccess: () => {
            toast.success("Login successful!", {
                description: "You are now logged in."
            })
            navigate("/")
        },
        onError: () => {
            toast.error("Invalid email or password")
        }
    })

    const handleLogin = handleSubmit(({ email, password }) => {
        login({ email, password })
    })


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
    )
}