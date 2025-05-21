import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useJobs } from "@/hooks/useJobs"
import { calculateStats } from "@/lib/data"
import {
  BriefcaseIcon,
  DollarSignIcon,
  AwardIcon,
  PercentIcon
} from "lucide-react"

export function DashboardStats() {
  const { jobs } = useJobs()
  const stats = calculateStats(jobs)

  return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">
              Active opportunities in your pipeline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Potential Value
            </CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalValue}</div>
            <p className="text-xs text-muted-foreground">
              Combined value of all opportunities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Won Jobs</CardTitle>
            <AwardIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.wonJobs}</div>
            <p className="text-xs text-muted-foreground">
              Successfully converted opportunities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <PercentIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.winRate}</div>
            <p className="text-xs text-muted-foreground">
              Percentage of won opportunities
            </p>
          </CardContent>
        </Card>
      </div>
  )
}
