import { useState } from "react"
import { statusOptions, availableTags } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { CheckIcon, FilterIcon, XIcon, SearchIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

export function JobFilter({ onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState(undefined)
  const [selectedTags, setSelectedTags] = useState([])
  const [isTagsOpen, setIsTagsOpen] = useState(false)

  const handleStatusChange = value => {
    const status = value === "all" ? undefined : value
    setSelectedStatus(status)
    onFilterChange(status, searchTerm, selectedTags)
  }

  const handleSearchChange = e => {
    setSearchTerm(e.target.value)
    onFilterChange(selectedStatus, e.target.value, selectedTags)
  }

  const handleTagToggle = tag => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tag)
          ? prev.filter(t => t !== tag)
          : [...prev, tag]

      onFilterChange(selectedStatus, searchTerm, newTags)
      return newTags
    })
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedStatus(undefined)
    setSelectedTags([])
    onFilterChange(undefined, "", [])
  }

  return (
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 md:items-center">
        <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-8"
          />
        </div>

        <div className="flex space-x-2">
          <Select
              value={selectedStatus || "all"}
              onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover open={isTagsOpen} onOpenChange={setIsTagsOpen}>
            <PopoverTrigger asChild>
              <Button
                  variant="outline"
                  className={cn(
                      "flex items-center gap-1",
                      selectedTags.length > 0 &&
                      "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                  )}
              >
                <FilterIcon className="h-4 w-4" />
                Tags
                {selectedTags.length > 0 && (
                    <Badge
                        variant="secondary"
                        className="ml-1 bg-primary-foreground text-primary"
                    >
                      {selectedTags.length}
                    </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="end">
              <div className="p-2 flex flex-col gap-1 max-h-[300px] overflow-y-auto">
                {availableTags.map(tag => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                          id={`tag-${tag}`}
                          checked={selectedTags.includes(tag)}
                          onCheckedChange={() => handleTagToggle(tag)}
                      />
                      <label
                          htmlFor={`tag-${tag}`}
                          className="text-sm flex-1 cursor-pointer py-1"
                      >
                        {tag}
                      </label>
                      {selectedTags.includes(tag) && (
                          <CheckIcon className="h-4 w-4 text-primary" />
                      )}
                    </div>
                ))}
              </div>
              {selectedTags.length > 0 && (
                  <div className="border-t p-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center text-xs"
                        onClick={() => {
                          setSelectedTags([])
                          onFilterChange(selectedStatus, searchTerm, [])
                        }}
                    >
                      Clear selections
                    </Button>
                  </div>
              )}
            </PopoverContent>
          </Popover>

          {(searchTerm || selectedStatus || selectedTags.length > 0) && (
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearFilters}
                  title="Clear all filters"
              >
                <XIcon className="h-4 w-4" />
              </Button>
          )}
        </div>
      </div>
  )
}
