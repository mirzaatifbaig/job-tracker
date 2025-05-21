import { useState } from "react"
import { BriefcaseIcon, BellIcon, UserIcon } from "lucide-react"
import { currentUser } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useJobs } from "@/hooks/useJobs"
import { format } from "date-fns"

export function Header() {
  const { jobs } = useJobs()
  const [showNotifications, setShowNotifications] = useState(false)

  // Get upcoming reminders (not sent and due within the next 3 days)
  const now = new Date()
  const threeDaysLater = new Date(now)
  threeDaysLater.setDate(now.getDate() + 3)

  const upcomingReminders = jobs
      .flatMap(job =>
          job.reminders
              .filter(
                  reminder =>
                      !reminder.sent &&
                      reminder.date >= now &&
                      reminder.date <= threeDaysLater
              )
              .map(reminder => ({
                ...reminder,
                job: {
                  id: job.id,
                  company: job.company
                }
              }))
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime())

  const pastDueReminders = jobs
      .flatMap(job =>
          job.reminders
              .filter(reminder => !reminder.sent && reminder.date < now)
              .map(reminder => ({
                ...reminder,
                job: {
                  id: job.id,
                  company: job.company
                }
              }))
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime())

  const allReminders = [...pastDueReminders, ...upcomingReminders]
  const hasNotifications = allReminders.length > 0

  return (
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center">
            <BriefcaseIcon className="mr-2 h-6 w-6" />
            <span className="text-base sm:text-lg md:text-xl font-semibold">Freelance CRM</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNotifications(true)}
                  className="relative"
              >
                <BellIcon className="h-5 w-5" />
                {hasNotifications && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500">
                  <span className="sr-only">New notifications</span>
                </span>
                )}
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {currentUser.name
                          .split(" ")
                          .map(n => n[0])
                          .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {currentUser.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Notifications Dialog */}
        <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Notifications</DialogTitle>
              <DialogDescription>
                Your upcoming and past-due reminders
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[60vh] overflow-y-auto pr-1 -mr-1">
              {allReminders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="rounded-full bg-muted p-3">
                      <BellIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-sm font-medium">No reminders</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      You don't have any upcoming or past-due reminders.
                    </p>
                  </div>
              ) : (
                  <>
                    {pastDueReminders.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-destructive mb-2">
                            Past Due
                          </h3>
                          <div className="space-y-2">
                            {pastDueReminders.map(reminder => (
                                <div
                                    key={reminder.id}
                                    className="flex items-start gap-3 rounded-lg border p-3 bg-destructive/5"
                                >
                                  <BellIcon className="h-5 w-5 text-destructive mt-0.5" />
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">
                                      {reminder.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {reminder.job.company}
                                    </p>
                                    {reminder.description && (
                                        <p className="text-sm mt-1">
                                          {reminder.description}
                                        </p>
                                    )}
                                    <p className="text-xs text-destructive mt-2">
                                      Due{" "}
                                      {format(
                                          new Date(reminder.date),
                                          "MMM d, yyyy h:mm a"
                                      )}
                                    </p>
                                  </div>
                                </div>
                            ))}
                          </div>
                        </div>
                    )}

                    {upcomingReminders.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium mb-2">Upcoming</h3>
                          <div className="space-y-2">
                            {upcomingReminders.map(reminder => (
                                <div
                                    key={reminder.id}
                                    className="flex items-start gap-3 rounded-lg border p-3"
                                >
                                  <BellIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">
                                      {reminder.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {reminder.job.company}
                                    </p>
                                    {reminder.description && (
                                        <p className="text-sm mt-1">
                                          {reminder.description}
                                        </p>
                                    )}
                                    <p
                                        className={cn(
                                            "text-xs mt-2",
                                            isWithin24Hours(reminder.date)
                                                ? "text-amber-600 dark:text-amber-400"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                      {isToday(reminder.date)
                                          ? `Today at ${format(
                                              new Date(reminder.date),
                                              "h:mm a"
                                          )}`
                                          : format(
                                              new Date(reminder.date),
                                              "MMM d, yyyy h:mm a"
                                          )}
                                    </p>
                                  </div>
                                </div>
                            ))}
                          </div>
                        </div>
                    )}
                  </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </header>
  )
}

// Helper functions
function isToday(date) {
  const today = new Date()
  return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  )
}

function isWithin24Hours(date) {
  const now = new Date()
  const twentyFourHoursLater = new Date(now)
  twentyFourHoursLater.setHours(now.getHours() + 24)

  return date >= now && date <= twentyFourHoursLater
}
