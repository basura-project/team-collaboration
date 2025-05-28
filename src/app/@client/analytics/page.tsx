"use client";

import { useState, useEffect, use, AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";

import styles from "./page.module.scss";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import WasteTrends from "../components/Chart";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";

import { ChevronsUpDown, Settings2 } from "lucide-react";
import { getAnalyticsDataForProperty, getClientWasteData, getEnvironmentData } from "@/services/index";

import WasteDataUI from "../components/WasteDataUI";
import { set } from "date-fns";


interface WasteDate {
  date: string;
  value: number;
}

interface WasteTypeData {
  wasteType: string;
  totalWasteCollected: number;
  dates: WasteDate[];
}

interface PropertyWasteData {
  propertyId: string;
  propertyType: string;
  unit: string;
  wasteTypes: WasteTypeData[];
}

interface EnvironmentalSavings {
  trees: number;
  water: number;
  landfill: number;
  energy: number;
  carbon: number;
  oil: number;
  resources?: number; // Optional, if you want to include it
}

interface PropertyEnvironmentalSavings extends EnvironmentalSavings {
  propertyId: string;
  propertyName: string;
}

const expandedApiDataForTesting = [
  {
    "propertyId": "PROP00009",
    "propertyType": "Resident Buildings",
    "unit": "lbs",
    "wasteTypes": [
      {
        "wasteType": "E-Waste",
        "dates": [
          // Original data
          { "date": "2025-03-10", "value": 20 },
          // Added data
          { "date": "2025-02-15", "value": 18 }, // Feb
          { "date": "2025-03-20", "value": 25 }, // Another one in Mar
          { "date": "2025-04-05", "value": 30 }, // Apr
          { "date": "2024-12-28", "value": 15 }, // Previous year
        ],
        "totalWasteCollected": 20, // This value is likely inaccurate now, but ignored by our processing logic
      },
      {
        "wasteType": "Plastic",
        "dates": [
          // Original data
          { "date": "2025-03-10", "value": 22 },
          // Added data
          { "date": "2025-02-10", "value": 20 }, // Feb
          { "date": "2025-02-25", "value": 28 }, // Another Feb
          { "date": "2025-03-25", "value": 35 }, // Another Mar
          { "date": "2025-04-08", "value": 40 }, // Apr (Today in example context)
          { "date": "2025-04-12", "value": 38 }, // Future Apr
        ],
        "totalWasteCollected": 22, // Inaccurate
      },
      {
        "wasteType": "Metals",
        "dates": [
          // Original data
          { "date": "2025-03-10", "value": 30 },
          // Added data
          { "date": "2025-02-18", "value": 25 }, // Feb
          { "date": "2025-04-02", "value": 45 }, // Apr
        ],
        "totalWasteCollected": 30, // Inaccurate
      },
      // You could even add a completely new waste type if needed for testing
      {
        "wasteType": "Paper", // New type for testing
        "dates": [
            { "date": "2025-03-05", "value": 50 },
            { "date": "2025-04-01", "value": 60 },
        ],
        "totalWasteCollected": 0, // Default/Inaccurate
      }
    ]
  }
];

const savingsValues = {
  trees: 'trees',
  water: 'gallons',
  landfill: 'cubic yards',
  energy: 'kWh',
  carbon: 'kg CO2',
  oil: 'gallons',
  resources: 'tons'
}


export default function AnalyticsPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openPanels, setOpenPanels] = useState<number[]>([0]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [tableData, setTableData] = useState<any>(null);
  // const [testAPIData, setTestAPIData] = useState(expandedApiDataForTesting);
  const [selectedPropery, setSelectedProperty] = useState<string>("");
  const [environmentalSavings, setEnvironmentalSavings] = useState<PropertyEnvironmentalSavings[] | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      const analyticsData = await getAnalyticsDataForProperty();
      setAnalyticsData(analyticsData);
    };
    fetchData();
  }, []);

  useEffect( () => {
    const fetchData = async () => {
      const tableData = await getClientWasteData();
      setSelectedProperty(tableData[0]?.propertyId);
      setTableData(tableData)
    };
    fetchData();
  }, [])

  useEffect(() => {
    const calculateEnvironmentalSavings = () => {
      if (!tableData) {
        setEnvironmentalSavings([]); // Clear savings if no data
        return;
      }

      const calculatedSavings: PropertyEnvironmentalSavings[] = tableData.map((data: PropertyWasteData) => {
        const wasteTypes = data.wasteTypes || [];

        // Initialize total savings for the current property
        const propertyTotalSavings: EnvironmentalSavings = {
          trees: 0,
          carbon: 0,
          water: 0,
          landfill: 0,
          energy: 0,
          oil: 0,
          resources: 0

        };

        wasteTypes.forEach((item) => {
          switch (item.wasteType) {
            case 'Paper':
              propertyTotalSavings.trees! += item.totalWasteCollected * 0.0085;
              propertyTotalSavings.water! += item.totalWasteCollected * 3.5;
              propertyTotalSavings.landfill! += item.totalWasteCollected * 0.00165;
              propertyTotalSavings.energy! += item.totalWasteCollected * 2.05;
              propertyTotalSavings.oil! += item.totalWasteCollected * 0.19;
              break;
            case 'Plastic':
              propertyTotalSavings.landfill! += item.totalWasteCollected * 0.015;
              propertyTotalSavings.energy! += item.totalWasteCollected * 2.887;
              propertyTotalSavings.oil! += item.totalWasteCollected * 0.3425;
              break;
            case 'Metals':
              propertyTotalSavings.oil! += item.totalWasteCollected * 0.8315;
              propertyTotalSavings.landfill! += item.totalWasteCollected * 0.005;
              propertyTotalSavings.energy! += item.totalWasteCollected * 7.0;
            case 'glass':
              propertyTotalSavings.oil! += item.totalWasteCollected * 0.0025;
              propertyTotalSavings.landfill! += item.totalWasteCollected * 0.001;
              propertyTotalSavings.energy! += item.totalWasteCollected * 0.021;
              propertyTotalSavings.resources! += item.totalWasteCollected * 0.0005;
            case 'compost':
              propertyTotalSavings.carbon! += item.totalWasteCollected * 0.000025;
              break;
            default:
              // Handle unknown waste types or do nothing
              console.warn(`Unknown waste type encountered: ${item.wasteType}`);
              break;
          }
        });

        return {
          propertyId: data.propertyId,
          ...propertyTotalSavings,
        };
      });

      setEnvironmentalSavings(calculatedSavings);
      // console.log("Calculated Environmental Savings per Property:", calculatedSavings);
    };

    calculateEnvironmentalSavings();

  }, [tableData, openPanels]);


  // Toggle all panels
  const toggleAll = () => {
    const allPanelIndices = Array.from({ length: tableData.length }, (_, index) => index);

    if (openPanels?.length === allPanelIndices.length && openPanels.every((panelIndex) => allPanelIndices.includes(panelIndex))) {
      // If all panels are open, close them all
      setOpenPanels([]);
      // setExpandedIndex(null); // Consider if you need this here
    } else {
      // Otherwise, open all panels
      setOpenPanels(allPanelIndices);
      // setExpandedIndex(0); // Consider if you want to expand the first panel when opening all
    }
  };

  const handleCardClick = (index: number) => {
    setOpenPanels(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
    setSelectedProperty(tableData[index].propertyId);
  };

  return (
    <>
      <Breadcrumb className="hidden md:flex -mt-[44px] z-50">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Analytics</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="w-full">
        <CardHeader className="space-y-2 flex">
          <div className="flex items-center justify-between">
            <div>
            <CardTitle className="text-2xl flex justify-between"><p>Analytics</p></CardTitle>
            <p className="text-md text-gray-800 pt-0">
              Metrics for garbage collection & report generation
            </p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm text-gray-700">Properties</p>
            <h2>{analyticsData && analyticsData.totalProperties}</h2>
          </div>
          </div>
          <Separator className="my-5" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-3">
                <Card className="flex flex-col justify-between">
                  <CardHeader className="pb-2">
                    <CardTitle>Month to Date Diversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h1 className="text-2xl font-bold">{analyticsData && analyticsData.monthToDate.diversionRate} %</h1>
                    {/* <p className="text-green-500">{analyticsData && analyticsData.totalDiversionRate}% from {analyticsData && analyticsData.totalDiversionRate.period}</p> */}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Month to Date Waste Diverted</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h1 className="text-2xl font-bold">{analyticsData && analyticsData.monthToDate.wasteDiverted} lbs</h1>
                    {/* <p className="text-red-500">{analyticsData.dailyWasteCollected.change}% from {analyticsData.dailyWasteCollected.period}</p> */}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Month to Date Waste Collected</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h1 className="text-2xl font-bold">{analyticsData && analyticsData.monthToDate.wasteCollected} lbs</h1>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Total Waste collected to Date</CardTitle>
                  </CardHeader>
                  <CardContent>
                  <h1 className="text-2xl font-bold">{analyticsData && analyticsData.totalWasteCollected.value} {analyticsData && analyticsData.totalWasteCollected.unit}</h1>
                  </CardContent>
                </Card>
          </div>
          <div className="flex justify-between items-center mt-4 mb-6">
          </div>
          <h1 className="text-xl mb-4">
            Metrics by date range and area filters
          </h1>
          <Separator />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-bold">Waste Collected</h4>
                <Button onClick={toggleAll} variant="outline">
                  {openPanels ? "Collapse All" : "Expand All"}
                </Button>
              </div>
              <div className="grid grid-cols-1 rounded-t-[0.75rem] overflow-hidden border-gray-300 collapsible-table">
                <Card className="rounded-none rounded-t-[0.75rem]">
                  <CardHeader
                    className={`flex flex-row justify-between ${styles.tableHeader}`}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  >
                    <div className="flex items-center">
                      <p className="text-gray-500 text-sm">Property ID</p>
                      <button className="text-gray-500">
                        <ChevronsUpDown />
                      </button>
                    </div>
                    <div className="flex items-center">
                      <p className="text-gray-500 text-sm">Property Type</p>
                      <button className="text-gray-500">
                        <ChevronsUpDown />
                      </button>
                    </div>
                    <div className="flex items-center">
                      <p className="text-gray-500 text-sm">
                        Total Waste Diverted
                      </p>
                      <button className="text-gray-500">
                        <ChevronsUpDown />
                      </button>
                    </div>
                  </CardHeader>
                </Card>
                {tableData && tableData.map((data: { propertyId: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; propertyType: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; totalWasteCollected: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; wasteTypes: any[] }, index: number) => (
                  <Card
                    className="rounded-none"
                    key={index}
                    onClick={() => handleCardClick(index)}
                  >
                    <CardHeader className="flex flex-row justify-between items-center cursor-pointer space-y-0">
                      <p className="font-bold">{data.propertyId}</p>
                      <p className="font-bold">{data.propertyType}</p>
                      <p className="font-bold">{data.totalWasteCollected} lbs</p>
                    </CardHeader>
                    {openPanels.includes(index) ?
                      (
                        <>
                          <CardContent>
                          <div className="grid grid-cols-1 gap-4">
                            <WasteDataUI wasteData={data.wasteTypes} />
                          </div>
                        </CardContent>
                        <CardFooter className="flex flex-col items-start">
                        <h1 className="font-bold mb-4">Green Score</h1>
                        {environmentalSavings &&
                        environmentalSavings.length > 0 &&
                        environmentalSavings.find((savings) => savings.propertyId === data.propertyId) ? (
                          <div className="flex flex-wrap gap-x-2 gap-y-3"> {/* Added max-w-xs and gap for spacing */}
                            {/* Retrieve the specific property's savings once to avoid repetitive .find() calls */}
                            {(() => {
                              const currentPropertySavings = environmentalSavings.find(
                                (savings) => savings.propertyId === data.propertyId
                              );
                              if (!currentPropertySavings) return null;

                              // Create an array of savings items to easily map over them
                              const savingsItems = [
                                { label: '🌳 Trees', value: currentPropertySavings.trees, unit: '' },
                                { label: '💧 Water', value: currentPropertySavings.water, unit: 'gallons' },
                                { label: '🗑️ Landfill', value: currentPropertySavings.landfill, unit: 'cubic yards' },
                                { label: '⚡ Energy', value: currentPropertySavings.energy, unit: 'kWh' },
                                { label: '💨 Carbon', value: currentPropertySavings.carbon, unit: 'kg CO2' }, // Using co2 as per calculation
                                { label: '⛽ Oil', value: currentPropertySavings.oil, unit: 'gallons' },
                              ];

                              return (
                                <>
                                  {savingsItems.map((item, index) => (
                                    // Only render if value is greater than 0
                                    item.value! > 0 && (
                                      <p key={index} className="text-sm w-[calc(33%-0.5rem)]"> {/* Adjusted width for 3 items per row */}
                                        {item.label}: {item.value?.toFixed(2)} {item.unit}
                                      </p>
                                    )
                                  ))}
                                </>
                              );
                            })()}
                          </div>
                        ) : (
                          <span className="text-gray-500">No Savings Data</span>
                        )}
                      </CardFooter>
                        </>
                      ): null }
                  </Card>
                ))}
              </div>
            </div>

            <div>
                <div className="grid grid-cols-1">
                  <div>
                    <WasteTrends propertyId={selectedPropery} data={tableData} />
                  </div>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
