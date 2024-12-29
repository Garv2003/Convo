import { MessageSquare } from "lucide-react"

const SideMessageView = () => {
    return (<div className='w-full flex flex-col m-2'>
        <div className="rounded-xl border bg-card text-card-foreground shadow h-[98vh] flex flex-col items-center justify-center p-6 space-y-4">
            <div className="w-24 h-24 rounded-full bg-muted/20 flex items-center justify-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground/60" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">No Conversation Selected</h3>
            <p className="text-muted-foreground text-center max-w-sm">
                Choose a user from the sidebar to start a new conversation or continue an existing one
            </p>
        </div>
    </div>)
}

export { SideMessageView }