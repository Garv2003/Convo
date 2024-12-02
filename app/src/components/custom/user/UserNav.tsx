import { LogOut, User } from "lucide-react"
import {
  Avatar, AvatarFallback, AvatarImage, DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger, Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui"
import type { Models } from "@/appwrite/config"
import { account } from "@/appwrite/config"
import { useEffect, useState } from "react"
import { useLogout } from "@/hooks"

export function UserNav() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null)
  const { logoutUser } = useLogout()

  useEffect(() => {
    const getUser = async () => {
      const user = await account.get()
      setUser(user)
    }
    getUser()
  }, [])

  return (
    <div className="w-[70px] h-[98vh] bg-secondary/10 p-2 my-2 rounded-lg">

      <div className="flex flex-col h-full justify-between items-center py-4">
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="relative h-10 w-10 rounded-full ring-offset-background transition-opacity hover:opacity-80 cursor-pointer">
                        <Avatar>
                          <AvatarImage alt={user?.name || "User avatar"} />
                          <AvatarFallback>
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex items-center space-x-4 pb-3">
                          <div className="space-y-2">
                            <p className="text-lg font-semibold leading-none">{user?.name || "User"}</p>
                            <p className="text-sm text-muted-foreground">
                              {user?.email || "user@example.com"}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span className="flex items-center">
                                Member since: {" "}
                                {user?.$createdAt
                                  ? new Date(user.$createdAt).toLocaleString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                  : "2023-08-26"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 cursor-pointer py-3"
                        onClick={logoutUser}
                      >
                        <LogOut className="mr-3 h-5 w-5" />
                        <span className="font-medium">Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-zinc-900 text-zinc-50 border-zinc-800">
                <p>Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={logoutUser}
                className="text-muted-foreground hover:text-red-600 transition-colors cursor-pointer"
              >
                <LogOut className="h-5 w-5" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-zinc-900 text-zinc-50 border-zinc-800">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
