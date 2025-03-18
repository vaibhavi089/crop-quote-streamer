
import React, { useState, useEffect } from "react";
import { fetchCropPrices, fetchCropDetails } from "@/services/api";
import CropSearch from "./CropSearch";
import CropPriceCard from "./CropPriceCard";
import { CropDetails } from "@/types";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cropDetails, setCropDetails] = useState<CropDetails[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      searchCrops(searchQuery);
    }
  }, [searchQuery]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const prices = await fetchCropPrices();
      // Get unique commodities
      const commodities = Array.from(new Set(prices.map(item => item.commodity)));
      
      // Fetch details for top 6 commodities
      const detailsPromises = commodities.slice(0, 6).map(crop => fetchCropDetails(crop));
      const details = await Promise.all(detailsPromises);
      
      setCropDetails(details);
    } catch (error) {
      console.error("Error loading initial data:", error);
      toast({
        title: "Error",
        description: "Failed to load crop price data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const searchCrops = async (query: string) => {
    setIsLoading(true);
    try {
      const details = await fetchCropDetails(query);
      if (details.priceData.length > 0) {
        setCropDetails([details]);
      } else {
        toast({
          title: "Not Found",
          description: `No results found for "${query}"`,
        });
      }
    } catch (error) {
      console.error("Error searching crops:", error);
      toast({
        title: "Error",
        description: "Failed to search for crop prices",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <CropSearch onSearch={handleSearch} />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading crop prices...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cropDetails.map((crop) => (
            <CropPriceCard key={crop.name} cropDetails={crop} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
