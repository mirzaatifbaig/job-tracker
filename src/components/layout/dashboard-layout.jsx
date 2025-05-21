import { Header } from "./header"
import { Sidebar } from "./sidebar"

export function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex flex-1">
                <Sidebar className="hidden md:block" />
                <main className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
