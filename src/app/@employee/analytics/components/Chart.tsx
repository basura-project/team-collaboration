"use client";

import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"; // ChartContainer component from Shadcn
import { getAnalyticsData } from "@/services";
import { DatePickerWithRange } from "./DatePicker";

interface GarbageSegregation {
  name: string;
  value: number;
}

// Color configuration for the charts
const COLORS = ["#e76e50", "#2a9d90", "#f4a462", "#e8c468", "#274754"];
const barChartConfig = {
  count: {
    label: "Submission",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [garbageSegregation, setGarbageSegregation] = useState<
    GarbageSegregation[]
  >([]);
  const [selectedRange, setSelectedRange] = useState<{
    from: string;
    to: string;
  }>({
    from: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    to: new Date().toISOString().slice(0, 10),
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const dummyData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Dummy Data",
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75,192,192,0.6)",
        hoverBorderColor: "rgba(75,192,192,1)",
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const data = await getAnalyticsData(selectedRange.from, selectedRange.to);
      setAnalyticsData(data);
      const garbageMap: { [key: string]: number } = {};
      data.forEach(
        (item: { garbage_attributes: { [key: string]: number } }) => {
          for (const key in item.garbage_attributes) {
            if (garbageMap[key]) {
              garbageMap[key] += item.garbage_attributes[key];
            } else {
              garbageMap[key] = item.garbage_attributes[key];
            }
          }
        }
      );
      const garbageAttributes: GarbageSegregation[] = Object.keys(
        garbageMap
      ).map((key) => ({
        name: key,
        value: garbageMap[key],
      }));
      setGarbageSegregation(garbageAttributes);
      setLoading(false);
    };

    try {
      fetchData();
    } catch (err) {
      console.error("Error fetching analytics data", err);
      setLoading(false);
    }
  }, [selectedRange]);

  const chartData = analyticsData.reduce(
    (acc: { date: string; count: number }[], curr) => {
      const date = curr.timestamp.slice(0, 10);
      const existingDateEntry = acc.find(
        (item: { date: string; count: number }) => item.date === date
      );

      if (existingDateEntry) {
        existingDateEntry.count += 1;
      } else {
        acc.push({ date, count: 1 });
      }

      return acc;
    },
    []
  );

  const handleDateRangeChange = (range: {
    from: Date | null;
    to: Date | null;
  }) => {
    if (range.from && range.to) {
      setSelectedRange({
        from: range.from.toISOString().slice(0, 10),
        to: range.to.toISOString().slice(0, 10),
      });
    }
  };

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-2">
          <div className="text-2xl font-bold">Analytics</div>
          <div className="text-md text-gray-800 pt-0">
            Metrics for daily submissions, waste collected
          </div>
          <Separator className="my-4" />

          {/* Submissions Bar Chart */}
          <CardHeader className="flex flex-row justify-between px-0">
            <CardTitle className="flex items-start">Submissions</CardTitle>
            <div className="flex justify-between items-center">
              <div className="relative mr-2">
                <DatePickerWithRange
                  date={{
                    from: new Date(selectedRange.from),
                    to: new Date(selectedRange.to),
                  }}
                  onDateChange={handleDateRangeChange}
                  placeholder="Select date range"
                />
              </div>
              <Button variant="default">Download</Button>
            </div>
          </CardHeader>
          <CardContent className="h-[200px] px-0">
            <ChartContainer config={barChartConfig} className="h-full w-full">
              {chartData.length === 0 ? (
                <div className="h-full w-full flex items-center justify-center text-gray-500">
                  No submission data available for the selected date range
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                  >
                    <XAxis dataKey="date" minTickGap={10} />
                    <YAxis domain={[0, "dataMax"]} />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <Bar dataKey="count" fill="#2a9d90" radius={0} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartContainer>
          </CardContent>

          {/* Garbage Segregation Pie Chart */}
          <Card className="w-full shadow-none border-none p-0">
            <CardHeader className="flex flex-row justify-between px-0">
              <CardTitle>Garbage Segregation</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <ChartContainer
                config={barChartConfig}
                className="w-[50%] h-[360px]"
              >
                {garbageSegregation.length === 0 ? (
                  <div className="h-full w-full flex items-center justify-center text-gray-500">
                    No garbage segregation data available for the selected date
                    range
                  </div>
                ) : (
                  <PieChart>
                    <Pie
                      data={garbageSegregation}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      label={({ name, value }) => `${name}: ${value} lbs`}
                    >
                      {garbageSegregation.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} lbs`, `${name}`]}
                    />
                  </PieChart>
                )}
              </ChartContainer>
              {garbageSegregation.length > 0 && (
                <div className="flex items-center justify-center mt-4">
                  {garbageSegregation.map((entry, index) => (
                    <div
                      key={entry.name}
                      className="flex items-center justify-center mx-2"
                    >
                      <div
                        className="w-3 h-3 rounded-full mr-1"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="text-sm">{entry.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
