import { Toaster } from "@/components/ui/sonner";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { JobList } from "@/components/dashboard/job-list";
import { JobProvider } from "@/context/JobContext.jsx";

function App() {
    return (
        <JobProvider>
            <DashboardLayout>
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your freelance jobs and clients
                        </p>
                    </div>

                    <DashboardStats />

                    <JobList />
                </div>
            </DashboardLayout>
            <Toaster />
        </JobProvider>
    );
}

export default App;
