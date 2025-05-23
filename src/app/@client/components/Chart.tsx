"use client";
import React, { memo, useMemo, useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { format } from 'date-fns'; // Using date-fns for robust date formatting

import { getGarbageAttributes } from "@/services/index";
import { date } from "zod";

interface WasteDate {
  date: string;
  value: number;
}
interface WasteTypeData {
  dates: WasteDate[];
  totalWasteCollected: number;
  wasteType: string;
}

interface PropertyWasteData {
  propertyId: string;
  propertyType: string;
  unit: string;
  wasteTypes: WasteTypeData[];
}

interface WasteData {
  date: string;
  [value: string]: number | string;
}

// Structure for a single data point in the output arrays
interface MonthlyWasteValue {
  date: string; // Month name like "January"
  value: number;
}

// New structure for the entire processed data: an object keyed by waste type name
interface ProcessedWasteDataByType {
  [wasteType: string]: MonthlyWasteValue[]; // e.g., { "Plastic": [...], "E-Waste": [...] }
}

interface Attribute {
  attribute_name: string;
  color: string;
}

// Define the possible granularity options
type ChartGranularity = 'monthly' | 'daily';

// Helper function to format monthly totals for a single waste type
const formatMonthlyData = (monthlyTotals: {
  [yearMonth: string]: number;
}): MonthlyWasteValue[] => {
  const sortedEntries = Object.entries(monthlyTotals).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return sortedEntries.map(([yearMonth, totalValue]) => {
    const dateObject = new Date(yearMonth + "-01T00:00:00Z");
    const monthName = dateObject.toLocaleString("default", {
      month: "long",
      timeZone: "UTC",
    });
    return {
      date: monthName,
      value: totalValue,
    };
  });
};

const WasteTrends = memo(({ data: apiData, propertyId }: { data: PropertyWasteData[], propertyId: string }) => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [chartGranularity, setChartGranularity] = useState<ChartGranularity>('monthly'); // Default to monthly
  const chartHeight = 120;
  const marginConfig = { top: 5, right: 30, left: 10, bottom: 5 };

  useEffect(() => {
    getGarbageAttributes().then((res) => {
      setAttributes(res);
    });
  }, []);

  // This will now return an object: { "WasteType1": [...], "WasteType2": [...] }
  const processedDataByType: ProcessedWasteDataByType = useMemo(() => {
    if (!apiData || apiData.length === 0) {
      console.log("API data is empty or invalid.");
      return {}; // Return empty object
    }

    const propertyData = apiData.filter((property) => property.propertyId === propertyId);
    if (!propertyData[0] || !propertyData[0].wasteTypes) {
      console.log("Property data or wasteTypes are missing.");
      return {};
    }

    // Initialize the main object to hold data arrays keyed by waste type
    const dataByWasteType: ProcessedWasteDataByType = {};

    // Iterate through each waste type provided in the API data
    propertyData[0].wasteTypes.forEach((wasteTypeData) => {

      console.log(`Processing waste type`, wasteTypeData);
      const wasteTypeLowerCase = wasteTypeData.wasteType.toLowerCase();

      if (chartGranularity === 'monthly') {
        // --- Monthly Aggregation Logic (Existing) ---
        const monthlyTotalsForThisType: { [yearMonth: string]: number } = {};
        wasteTypeData.dates.forEach((dateData) => {
          const yearMonth = dateData.date.substring(0, 7); // "YYYY-MM"
          monthlyTotalsForThisType[yearMonth] = (monthlyTotalsForThisType[yearMonth] || 0) + dateData.value;
        });
        // Use the existing helper to format monthly data
        dataByWasteType[wasteTypeLowerCase] = formatMonthlyData(monthlyTotalsForThisType);

      } else {
        // --- Daily Aggregation Logic (New) ---
        const dailyTotalsForThisType: { [fullDate: string]: number } = {}; // Keyed by "YYYY-MM-DD"
        wasteTypeData.dates.forEach((dateData) => {
          const fullDate = dateData.date; // "YYYY-MM-DD"
          // Sum up values if multiple entries exist for the *same day* for this waste type
          dailyTotalsForThisType[fullDate] = (dailyTotalsForThisType[fullDate] || 0) + dateData.value;
        });

        // Convert daily totals object to sorted array { date: "YYYY-MM-DD", value: N }
        const sortedDailyData = Object.entries(dailyTotalsForThisType)
          .map(([date, value]) => ({ date, value })) // Convert to { date: string, value: number }
          .sort((a, b) => a.date.localeCompare(b.date)); // Sort by date string "YYYY-MM-DD"

        dataByWasteType[wasteTypeLowerCase] = sortedDailyData;
      }
    });

    console.log(`Final Processed Data (Granularity: ${chartGranularity}):`, dataByWasteType);
    return dataByWasteType;
  }, [apiData, chartGranularity]);

  const allWasteTypes = useMemo(() => {
    if (!apiData || apiData.length === 0) return [];
    const propertyData = apiData[0];
    const wasteTypesSet = new Set<string>();
    propertyData.wasteTypes.forEach((w) =>
      wasteTypesSet.add(w.wasteType)
    );
    return Array.from(wasteTypesSet);
  }, [apiData]);

  const charts = useMemo(() => {
    return allWasteTypes.map((wasteType) => ({
      name: wasteType.charAt(0).toUpperCase() + wasteType.slice(1),
      color:
        attributes.find(
          (attribute: Attribute) =>
            attribute.attribute_name.charAt(0).toUpperCase() +
              attribute.attribute_name.slice(1) ===
            wasteType.charAt(0).toUpperCase() + wasteType.slice(1)
        )?.color || "#000000", // map color from attributes
      dataKey: wasteType.toLowerCase(),
    }));
  }, [allWasteTypes]);

  console.log(`Charts:`, charts);

  // Function to format X-axis ticks based on granularity
  const formatXAxisTick = (tickItem: string) => {
    if (chartGranularity === 'monthly') {
      // Input is already "MonthName", return as is
      return tickItem;
    } else {
      // Input is "YYYY-MM-DD"
      try {
          // Format date like "Apr 09" or "09/04" depending on locale preference
          return format(new Date(tickItem + 'T00:00:00Z'), 'MMM dd'); // e.g., Apr 09
          // Or use 'dd/MM' like: return format(new Date(tickItem + 'T00:00:00Z'), 'dd/MM');
      } catch (e) {
          return tickItem; // Fallback if date is invalid
      }
    }
  };

  return (
    <div className="space-y-8 p-6">
      {charts.map(({ name, color, dataKey }) => {
        const chartData = processedDataByType[dataKey];

        return (
          <div key={name} className="space-y-2">
            <h3 className="text-lg font-medium">{name} ({chartGranularity})</h3> {/* Indicate granularity in title */}
            <div className="h-[120px] w-full">
              <ResponsiveContainer width="100%" height={chartHeight}>
                <LineChart data={chartData} margin={marginConfig}>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    tickFormatter={formatXAxisTick}
                    interval="preserveStartEnd"
                  />
                  <Line
                    type="monotone"
                    dataKey={"value"}
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default WasteTrends;
