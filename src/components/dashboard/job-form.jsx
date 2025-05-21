import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { useJobs } from "@/hooks/useJobs"
import { statusOptions, availableTags } from "@/lib/data"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

const formSchema = z.object({
    company: z.string().min(1, "Company name is required"),
    position: z.string().min(1, "Position is required"),
    contactName: z.string().min(1, "Contact name is required"),
    contactEmail: z.string().email("Invalid email address"),
    contactPhone: z.string().optional(),
    status: z.string(),
    value: z.coerce
        .number()
        .min(0)
        .optional(),
    notes: z.string().optional()
})

export function JobForm({ job, onSubmit }) {
    const { addJob, updateJob } = useJobs()
    const [selectedTags, setSelectedTags] = useState(job?.tags || [])
    const [newTag, setNewTag] = useState("")

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: job
            ? {
                company: job.company,
                position: job.position,
                contactName: job.contactName,
                contactEmail: job.contactEmail,
                contactPhone: job.contactPhone || "",
                status: job.status,
                value: job.value,
                notes: job.notes || ""
            }
            : {
                company: "",
                position: "",
                contactName: "",
                contactEmail: "",
                contactPhone: "",
                status: "lead",
                value: undefined,
                notes: ""
            }
    })

    const handleAddTag = () => {
        if (!newTag.trim()) return

        const tag = newTag
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
        if (!selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag])
        }
        setNewTag("")
    }

    const handleRemoveTag = tag => {
        setSelectedTags(selectedTags.filter(t => t !== tag))
    }

    const handleSubmit = data => {
        if (job) {
            updateJob(job.id, {
                ...data,
                tags: selectedTags
            })
        } else {
            addJob({
                ...data,
                tags: selectedTags
            })
        }
        onSubmit()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company</FormLabel>
                                <FormControl>
                                    <Input placeholder="Company name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Position/Project</FormLabel>
                                <FormControl>
                                    <Input placeholder="Position or project title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormField
                        control={form.control}
                        name="contactName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contact Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Contact person" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="Contact email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="contactPhone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Contact phone" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {statusOptions.map(status => (
                                            <SelectItem key={status.value} value={status.value}>
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Value (Optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Project value"
                                        {...field}
                                        value={field.value || ""}
                                        onChange={e =>
                                            field.onChange(
                                                e.target.value === ""
                                                    ? undefined
                                                    : Number(e.target.value)
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormDescription>
                                    Estimated project value in USD
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div>
                    <FormLabel>Tags</FormLabel>
                    <div className="flex flex-wrap gap-2 mt-2 mb-3">
                        {selectedTags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-0 ml-1"
                                    onClick={() => handleRemoveTag(tag)}
                                >
                                    <X className="h-3 w-3" />
                                    <span className="sr-only">Remove {tag} tag</span>
                                </Button>
                            </Badge>
                        ))}
                    </div>
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Add a tag"
                            value={newTag}
                            onChange={e => setNewTag(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="button" size="sm" onClick={handleAddTag}>
                            Add
                        </Button>
                    </div>

                    <div className="mt-2">
                        <p className="text-sm text-muted-foreground mb-1">Popular tags:</p>
                        <div className="flex flex-wrap gap-1">
                            {availableTags.slice(0, 7).map(tag => (
                                <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs cursor-pointer hover:bg-accent"
                                    onClick={() => {
                                        if (!selectedTags.includes(tag)) {
                                            setSelectedTags([...selectedTags, tag])
                                        }
                                    }}
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Additional notes about this opportunity"
                                    className="min-h-[100px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={onSubmit}>
                        Cancel
                    </Button>
                    <Button type="submit">{job ? "Update Job" : "Add Job"}</Button>
                </div>
            </form>
        </Form>
    )
}
