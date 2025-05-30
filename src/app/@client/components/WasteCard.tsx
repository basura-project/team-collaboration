import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

import {
  getGarbageAttributes
} from "@/services/index";
import { usePreloader } from "../../../lib/preloader/usePreloaderHook";

export interface WasteCardProps {
    wasteType: string;
    color: string;
    totalWasteCollected: string;
    wasteComposition: string;
    recycledComposition: string;
  }

  interface Attribute {
    attribute_name: string;
    color: string;
  }

const WasteCard = ({ wasteType, totalWasteCollected, wasteComposition, recycledComposition }: WasteCardProps) => {
    const { data, isDataLoading, error, setData } = usePreloader(getGarbageAttributes, "Attribute list");
    const [color, setColor] = React.useState<any>(null);

  useEffect(() => {
    if (data) {
      const attribute = data.find((a: Attribute) => a.attribute_name.toLowerCase() === wasteType.toLowerCase());
      setColor(attribute.color);
    }
  }, [data, wasteType]);

   return (
    <div className="flex flex-col gap-2 mb-4">
    <div className="flex items-center gap-2 mb-4">
      <div style={{ backgroundColor: color }} className={`w-4 h-4 rounded`}></div>
      <span className="font-medium">{wasteType}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info size={16} className="text-gray-400" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Information about {wasteType.toLowerCase()} waste</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    <Card className="w-auto grow"> 
      <CardContent className="pt-6">
        <div className="space-y-2">
          <p className="text-gray-600">Total: {totalWasteCollected} lbs</p>
          <p className="text-gray-600">Composition: {wasteComposition || 0}%</p>
          {/* <p className="text-gray-600">Recycled composition: {recycledComposition || 0}%</p> */}
        </div>
      </CardContent>
    </Card>
  </div>
   );
};

export default WasteCard;