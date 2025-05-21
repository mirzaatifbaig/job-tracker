import { useState } from "react";
import { format } from "date-fns";
import { StatusBadge } from "@/components/ui/status-badge";
import { JobFilter } from "@/components/dashboard/job-filter";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertTriangleIcon,
  BellIcon,
  CalendarIcon,
  ClockIcon,
  DollarSignIcon,
  MoreHorizontalIcon,
  BriefcaseBusiness,
  PhoneIcon,
  MailIcon,
  UserIcon,
} from "lucide-react";
import { JobForm } from "./job-form";
import { ReminderForm } from "./reminder-form";
import { useJobs } from "@/hooks/useJobs";

export function JobList() {
  const { jobs, filterJobs, deleteJob } = useJobs();
  const [status, setStatus] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState([]);
  const [editingJob, setEditingJob] = useState(undefined);
  const [showJobForm, setShowJobForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderJobId, setReminderJobId] = useState(null);

  const filteredJobs = filterJobs(status, searchTerm, tags);

  const handleFilterChange = (newStatus, newSearchTerm, newTags) => {
    setStatus(newStatus);
    setSearchTerm(newSearchTerm);
    setTags(newTags);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleCloseJobForm = () => {
    setEditingJob(undefined);
    setShowJobForm(false);
  };

  const handleAddReminder = (jobId) => {
    setReminderJobId(jobId);
    setShowReminderForm(true);
  };

  const handleCloseReminderForm = () => {
    setReminderJobId(null);
    setShowReminderForm(false);
  };

  const promptDelete = (job) => {
    setJobToDelete(job);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (jobToDelete) {
      deleteJob(jobToDelete.id);
      setShowDeleteDialog(false);
      setJobToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setJobToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h2 className="text-2xl font-bold tracking-tight">Job Pipeline</h2>
        <div className="flex items-center gap-4">
          <Button onClick={() => setShowJobForm(true)}>Add New Job</Button>
        </div>
      </div>

      <JobFilter onFilterChange={handleFilterChange} />

      {filteredJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-muted p-3">
            <BriefcaseBusiness className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-medium">No jobs found</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {jobs.length === 0
              ? "You haven't added any jobs yet. Add your first job to get started."
              : "No jobs match your current filters. Try adjusting your search or filters."}
          </p>
          <Button
            onClick={() => setShowJobForm(true)}
            variant="outline"
            className="mt-4"
          >
            Add New Job
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <Card
              key={job.id}
              className={cn(
                "flex flex-col",
                job.status === "won" &&
                  "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20",
                job.status === "lost" &&
                  "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20",
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{job.company}</CardTitle>
                    <CardDescription className="mt-1">
                      {job.position}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditJob(job)}>
                        Edit Job
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAddReminder(job.id)}
                      >
                        Add Reminder
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => promptDelete(job)}
                        className="text-destructive focus:text-destructive"
                      >
                        Delete Job
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center mt-2 space-x-1">
                  <StatusBadge status={job.status} />
                  {job.value && (
                    <div className="flex items-center text-sm text-muted-foreground ml-2">
                      <DollarSignIcon className="h-3.5 w-3.5 mr-1" />
                      {job.value.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="grid gap-2">
                  <div className="flex items-center text-sm">
                    <UserIcon className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    {job.contactName}
                  </div>
                  <div className="flex items-center text-sm">
                    <MailIcon className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    <a
                      href={`mailto:${job.contactEmail}`}
                      className="text-primary hover:underline truncate max-w-[200px]"
                    >
                      {job.contactEmail}
                    </a>
                  </div>
                  {job.contactPhone && (
                    <div className="flex items-center text-sm">
                      <PhoneIcon className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                      <a
                        href={`tel:${job.contactPhone}`}
                        className="hover:underline"
                      >
                        {job.contactPhone}
                      </a>
                    </div>
                  )}
                </div>

                {job.notes && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {job.notes}
                    </p>
                  </div>
                )}

                {job.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1">
                    {job.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {job.reminders.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Reminders
                    </p>
                    {job.reminders.map((reminder) => {
                      const isPast = new Date(reminder.date) < new Date();
                      return (
                        <div
                          key={reminder.id}
                          className={cn(
                            "flex items-center justify-between p-2 text-xs rounded-md bg-muted",
                            reminder.sent ? "opacity-50" : "",
                            isPast && !reminder.sent
                              ? "bg-amber-50 dark:bg-amber-950/20"
                              : "",
                          )}
                        >
                          <div className="flex items-center">
                            {isPast && !reminder.sent ? (
                              <AlertTriangleIcon className="h-3.5 w-3.5 mr-2 text-amber-500" />
                            ) : (
                              <BellIcon className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                            )}
                            <span>{reminder.title}</span>
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span>
                              {format(new Date(reminder.date), "MM/dd/yy")}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t bg-muted/50 py-2 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                  Created {format(new Date(job.createdAt), "MMM d, yyyy")}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Job Dialog */}
      <Dialog open={showJobForm} onOpenChange={setShowJobForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingJob ? "Edit Job" : "Add New Job"}</DialogTitle>
            <DialogDescription>
              {editingJob
                ? "Update the job details below."
                : "Enter the details for the new job."}
            </DialogDescription>
          </DialogHeader>
          <JobForm job={editingJob} onSubmit={handleCloseJobForm} />
        </DialogContent>
      </Dialog>

      {/* Add Reminder Dialog */}
      <Dialog open={showReminderForm} onOpenChange={setShowReminderForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Reminder</DialogTitle>
            <DialogDescription>
              Set a reminder for follow-ups, meetings, or other important
              events.
            </DialogDescription>
          </DialogHeader>
          {reminderJobId && (
            <ReminderForm
              jobId={reminderJobId}
              onSubmit={handleCloseReminderForm}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {jobToDelete?.company} -{" "}
              {jobToDelete?.position}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
