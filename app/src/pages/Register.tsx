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
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { account, ID, databases, COLLECTION_ID_USERS, DATABASE_ID } from "../appwrite/config"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function Register() {
    const navigate = useNavigate()
    const registerSchema = z.object({
        name: z.string().min(3, "Name must be at least 3 characters"),
        email: z.string().email("Invalid email"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6, "Password must be at least 6 characters")
    }).refine(({ password, confirmPassword }) => password === confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    })

    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema)
    })

    const { mutate: registerUser, isPending } = useMutation({
        mutationFn: async ({ name, email, password }: z.infer<typeof registerSchema>) => {
            const user = await account.create(ID.unique(), email, password, name)
            await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID_USERS,
                user.$id,
                {
                    name,
                    email,
                    status: 'offline',
                    lastSeen: new Date().toISOString(),
                    lastPing: new Date().toISOString(),
                }
            )
            return user
        },
        onSuccess: () => {
            toast.success("Account created successfully!")
            navigate("/login")
        },
        onError: (error) => {
            console.error('Registration error:', error)
            toast.error("Account creation failed!")
        }
    })

    const handleRegister = handleSubmit(({ name, email, password, confirmPassword }) => {
        registerUser({ name, email, password, confirmPassword })
    })

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