import { LogOut, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Models } from "appwrite"
import { account } from "@/appwrite/config"
import { useEffect, useState } from "react"

interface UserNavProps {
  onLogout?: () => void
}

export function UserNav({ onLogout }: UserNavProps) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null)

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
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email || "user@example.com"}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                        onClick={onLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
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
                onClick={onLogout}
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
