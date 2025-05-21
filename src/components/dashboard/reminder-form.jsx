import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useJobs } from "@/hooks/useJobs.jsx";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
});

export function ReminderForm({ jobId, reminder, onSubmit }) {
  const { addReminder, updateReminder } = useJobs();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: reminder
      ? {
          title: reminder.title,
          description: reminder.description || "",
          date: reminder.date.toISOString().slice(0, 16), // Format to YYYY-MM-DDThh:mm
        }
      : {
          title: "",
          description: "",
          date: new Date(Date.now() + 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 16), // Tomorrow
        },
  });

  const handleSubmit = (data) => {
    if (reminder) {
      updateReminder(reminder.id, {
        ...data,
        date: new Date(data.date),
        sent: false, // Reset sent status when updating
      });
    } else {
      addReminder(jobId, {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
      });
    }
    onSubmit();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Reminder title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional details"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date & Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onSubmit}>
            Cancel
          </Button>
          <Button type="submit">
            {reminder ? "Update Reminder" : "Add Reminder"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
