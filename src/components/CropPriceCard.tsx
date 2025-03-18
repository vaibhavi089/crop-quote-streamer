
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CropDetails } from "@/types";
import PriceChart from "./PriceChart";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CropPriceCardProps {
  cropDetails: CropDetails;
}

const CropPriceCard: React.FC<CropPriceCardProps> = ({ cropDetails }) => {
  // Sort data by date for the chart
  const sortedData = [...cropDetails.priceData].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  // Calculate price trend (simple comparison of first and last values)
  const isPriceUp = sortedData.length > 1 && 
    sortedData[sortedData.length - 1].modalPrice > sortedData[0].modalPrice;
  
  // Calculate percentage change
  const calculatePercentageChange = () => {
    if (sortedData.length < 2) return 0;
    
    const oldPrice = sortedData[0].modalPrice;
    const newPrice = sortedData[sortedData.length - 1].modalPrice;
    
    if (oldPrice === 0) return 0;
    
    const change = ((newPrice - oldPrice) / oldPrice) * 100;
    return change;
  };
  
  const percentageChange = calculatePercentageChange();
  const percentageText = `${Math.abs(percentageChange).toFixed(2)}%`;

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">{cropDetails.name}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant={percentageChange >= 0 ? "default" : "destructive"}
              className={`flex items-center gap-1 ${percentageChange >= 0 ? "bg-green-500" : "bg-red-500"}`}
            >
              {percentageChange >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {percentageText}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Min Price</p>
            <p className="text-lg font-semibold">₹{cropDetails.avgMinPrice.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Modal Price</p>
            <p className="text-lg font-semibold">₹{cropDetails.avgModalPrice.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Max Price</p>
            <p className="text-lg font-semibold">₹{cropDetails.avgMaxPrice.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Price Trend</p>
          <PriceChart data={sortedData.slice(-7)} height={120} />
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">Available in {cropDetails.markets.length} markets</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CropPriceCard;
