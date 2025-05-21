import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { statusOptions } from "@/lib/data"
import {
  BriefcaseIcon,
  BarChartIcon,
  SettingsIcon,
  CalendarIcon,
  UsersIcon,
  PanelLeftIcon
} from "lucide-react"
import {useJobs} from "@/hooks/useJobs.jsx";

export function Sidebar({ className }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { jobs } = useJobs()

  // Count jobs by status
  const jobCountByStatus = statusOptions.reduce((acc, status) => {
    acc[status.value] = jobs.filter(job => job.status === status.value).length
    return acc
  }, {})

  const totalJobs = jobs.length

  return (
      <div
          className={cn(
              "flex h-screen flex-col border-r bg-muted/40 transition-all duration-300",
              isCollapsed ? "w-[70px]" : "w-[240px]",
              className
          )}
      >
        <div className="flex h-14 items-center justify-between border-b px-3 py-2">
          {!isCollapsed && (
              <div className="text-sm font-semibold">Navigation</div>
          )}
          <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn("h-8 w-8", isCollapsed && "ml-auto")}
          >
            <PanelLeftIcon
                className={cn(
                    "h-4 w-4 transition-transform",
                    isCollapsed && "rotate-180"
                )}
            />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            <Button
                variant="ghost"
                className={cn(
                    "justify-start",
                    isCollapsed && "justify-center px-2"
                )}
            >
              <BriefcaseIcon className="mr-2 h-4 w-4" />
              {!isCollapsed && <span>Dashboard</span>}
            </Button>
            <Button
                variant="ghost"
                className={cn(
                    "justify-start text-muted-foreground",
                    isCollapsed && "justify-center px-2"
                )}
            >
              <BarChartIcon className="mr-2 h-4 w-4" />
              {!isCollapsed && <span>Reports</span>}
            </Button>
            <Button
                variant="ghost"
                className={cn(
                    "justify-start text-muted-foreground",
                    isCollapsed && "justify-center px-2"
                )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {!isCollapsed && <span>Calendar</span>}
            </Button>
            <Button
                variant="ghost"
                className={cn(
                    "justify-start text-muted-foreground",
                    isCollapsed && "justify-center px-2"
                )}
            >
              <UsersIcon className="mr-2 h-4 w-4" />
              {!isCollapsed && <span>Contacts</span>}
            </Button>
            <Button
                variant="ghost"
                className={cn(
                    "justify-start text-muted-foreground",
                    isCollapsed && "justify-center px-2"
                )}
            >
              <SettingsIcon className="mr-2 h-4 w-4" />
              {!isCollapsed && <span>Settings</span>}
            </Button>
          </nav>

          {!isCollapsed && (
              <div className="mt-6 px-3">
                <h3 className="mb-2 text-xs font-medium text-muted-foreground">
                  Job Pipeline
                </h3>
                <div className="space-y-1">
                  {statusOptions.map(status => (
                      <div
                          key={status.value}
                          className="flex justify-between items-center py-1"
                      >
                        <div className="flex items-center">
                          <div
                              className={cn(
                                  "h-2 w-2 rounded-full mr-2",
                                  status.color.includes("bg-green")
                                      ? "bg-green-500"
                                      : status.color.includes("bg-blue")
                                          ? "bg-blue-500"
                                          : status.color.includes("bg-yellow")
                                              ? "bg-yellow-500"
                                              : status.color.includes("bg-red")
                                                  ? "bg-red-500"
                                                  : status.color.includes("bg-purple")
                                                      ? "bg-purple-500"
                                                      : status.color.includes("bg-orange")
                                                          ? "bg-orange-500"
                                                          : status.color.includes("bg-indigo")
                                                              ? "bg-indigo-500"
                                                              : "bg-gray-500"
                              )}
                          />
                          <span className="text-xs">{status.label}</span>
                        </div>
                        <span className="text-xs font-medium">
                    {jobCountByStatus[status.value] || 0}
                  </span>
                      </div>
                  ))}
                  <div className="flex justify-between items-center py-1 border-t mt-1 pt-2">
                    <span className="text-xs font-medium">Total</span>
                    <span className="text-xs font-medium">{totalJobs}</span>
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
  )
}
