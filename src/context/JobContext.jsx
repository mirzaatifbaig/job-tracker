import { createContext, useState, useEffect } from "react"
import { mockJobs } from "@/lib/data"
import { useToast } from "@/hooks/use-toast.jsx"

export let JobContext;
JobContext = createContext(undefined);

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading data from API
    const loadJobs = () => {
      setLoading(true)
      setTimeout(() => {
        setJobs(mockJobs)
        setLoading(false)
      }, 800) // Simulate network delay
    }

    loadJobs()

    // Check for due reminders on load
    const checkReminders = () => {
      const now = new Date()
      let reminderFound = false

      mockJobs.forEach(job => {
        job.reminders.forEach(reminder => {
          if (!reminder.sent && reminder.date <= now) {
            reminderFound = true
            toast({
              title: `Reminder: ${reminder.title}`,
              description: `For ${job.company} - ${reminder.description || ""}`,
              duration: 5000
            })
          }
        })
      })

      return reminderFound
    }

    const hasReminders = checkReminders()
    if (hasReminders) {
      // Update reminder status to sent
      const updatedJobs = mockJobs.map(job => ({
        ...job,
        reminders: job.reminders.map(reminder =>
            reminder.date <= new Date() ? { ...reminder, sent: true } : reminder
        )
      }))

      setJobs(updatedJobs)
    }
  }, [toast])

  const generateId = () =>
      Math.random()
          .toString(36)
          .substring(2, 10)

  const addJob = job => {
    const newJob = {
      ...job,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      reminders: []
    }

    setJobs(prev => [...prev, newJob])
    toast({
      title: "Job Added",
      description: `${job.company} - ${job.position} has been added`
    })
  }

  const updateJob = (id, data) => {
    setJobs(prev =>
        prev.map(job =>
            job.id === id ? { ...job, ...data, updatedAt: new Date() } : job
        )
    )
    toast({
      title: "Job Updated",
      description: `Job information has been updated`
    })
  }

  const deleteJob = id => {
    setJobs(prev => prev.filter(job => job.id !== id))
    toast({
      title: "Job Deleted",
      description: `Job has been removed from your list`,
      variant: "destructive"
    })
  }

  const getJob = id => {
    return jobs.find(job => job.id === id)
  }

  const filterJobs = (status, searchTerm, tags) => {
    return jobs.filter(job => {
      // Filter by status
      if (status && job.status !== status) return false

      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        const matchesSearch =
            job.company.toLowerCase().includes(term) ||
            job.position.toLowerCase().includes(term) ||
            job.contactName.toLowerCase().includes(term) ||
            job.notes?.toLowerCase().includes(term)

        if (!matchesSearch) return false
      }

      // Filter by tags
      if (tags && tags.length > 0) {
        const hasMatchingTag = tags.some(tag => job.tags.includes(tag))
        if (!hasMatchingTag) return false
      }

      return true
    })
  }

  const addReminder = (jobId, reminder) => {
    const newReminder = {
      ...reminder,
      id: generateId(),
      jobId,
      sent: false
    }

    setJobs(prev =>
        prev.map(job =>
            job.id === jobId
                ? {
                  ...job,
                  reminders: [...job.reminders, newReminder],
                  updatedAt: new Date()
                }
                : job
        )
    )

    toast({
      title: "Reminder Set",
      description: `Reminder "${reminder.title}" has been set`
    })
  }

  const updateReminder = (id, data) => {
    setJobs(prev =>
        prev.map(job => ({
          ...job,
          reminders: job.reminders.map(reminder =>
              reminder.id === id ? { ...reminder, ...data } : reminder
          ),
          updatedAt: new Date()
        }))
    )
  }

  const deleteReminder = id => {
    setJobs(prev =>
        prev.map(job => ({
          ...job,
          reminders: job.reminders.filter(reminder => reminder.id !== id),
          updatedAt: job.reminders.some(r => r.id === id)
              ? new Date()
              : job.updatedAt
        }))
    )

    toast({
      title: "Reminder Deleted",
      description: "The reminder has been deleted"
    })
  }

  return (
      <JobContext.Provider
          value={{
            jobs,
            loading,
            addJob,
            updateJob,
            deleteJob,
            getJob,
            filterJobs,
            addReminder,
            updateReminder,
            deleteReminder
          }}
      >
        {children}
      </JobContext.Provider>
  )
}


