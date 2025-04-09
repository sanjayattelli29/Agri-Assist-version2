
import { useState } from "react";
import { Star, Filter, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface FertilizerProduct {
  id: number;
  crop_name: string;
  low_cost_fertilizer: string;
  low_cost_rating: number;
  low_cost_buy_link: string;
  low_cost_image: string;
  medium_cost_fertilizer: string;
  medium_cost_rating: number;
  medium_cost_buy_link: string;
  medium_cost_image: string;
  high_cost_fertilizer: string;
  high_cost_rating: number;
  high_cost_buy_link: string;
  high_cost_image: string;
}

const FertilizerGuide = () => {
  const { t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState<string>("all");
  const [selectedPriceCategory, setSelectedPriceCategory] = useState<string>("all");
  const [minRating, setMinRating] = useState<number>(0);

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['fertilizer-products'],
    queryFn: async () => {
      console.log('Fetching fertilizer products...');
      const { data, error } = await supabase
        .from('fertilizer_products')
        .select('*');

      if (error) {
        console.error('Error fetching fertilizer products:', error);
        throw error;
      }
      
      console.log('Fetched products:', data);
      return data as FertilizerProduct[];
    },
  });

  const { data: uniqueCrops = [] } = useQuery({
    queryKey: ['unique-fertilizer-crops'],
    queryFn: async () => {
      console.log('Fetching unique crops for fertilizer...');
      const { data, error } = await supabase
        .from('fertilizer_products')
        .select('crop_name');
      
      if (error) {
        console.error('Error fetching unique crops:', error);
        return [];
      }

      const uniqueCropNames = Array.from(new Set(data.map(item => item.crop_name)));
      console.log('Unique fertilizer crop names:', uniqueCropNames);
      return uniqueCropNames;
    },
  });

  const getFilteredProducts = () => {
    console.log('Filtering products with:', {
      selectedCrop,
      selectedPriceCategory,
      minRating,
      totalProducts: products.length
    });
    
    return products.filter((product) => {
      const cropMatch = selectedCrop === "all" || product.crop_name === selectedCrop;
      let ratingMatch = false;
      let priceMatch = false;

      if (selectedPriceCategory === "affordable") {
        ratingMatch = product.low_cost_rating >= minRating;
        priceMatch = true;
      } else if (selectedPriceCategory === "moderate") {
        ratingMatch = product.medium_cost_rating >= minRating;
        priceMatch = true;
      } else if (selectedPriceCategory === "premium") {
        ratingMatch = product.high_cost_rating >= minRating;
        priceMatch = true;
      } else {
        ratingMatch = Math.max(
          product.low_cost_rating,
          product.medium_cost_rating,
          product.high_cost_rating
        ) >= minRating;
        priceMatch = true;
      }

      return cropMatch && ratingMatch && priceMatch;
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 fill-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const renderProductCard = (
    name: string,
    rating: number,
    buyLink: string,
    imageUrl: string,
    priceCategory: string
  ) => {
    console.log('Rendering product card:', { name, imageUrl });
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="w-full mb-4">
            <AspectRatio ratio={4/3}>
              <img
                src={imageUrl}
                alt={name}
                className="rounded-lg object-cover w-full h-full"
                onError={(e) => {
                  console.error(`Error loading image for ${name}:`, e);
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </AspectRatio>
          </div>
          <CardTitle className="text-xl">{name}</CardTitle>
          <CardDescription>
            Price Category: {priceCategory}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Rating:</span>
              {renderStars(rating)}
            </div>
          </div>
        </CardContent>
        <CardFooter className="mt-auto">
          <Button
            className="w-full"
            onClick={() => window.open(buyLink, "_blank")}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Buy Product
          </Button>
        </CardFooter>
      </Card>
    );
  };

  if (error) {
    console.error('Error in FertilizerGuide:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading fertilizer products. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Section */}
          <div className="w-full md:w-64 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg h-fit sticky top-20">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Crop Name</Label>
                <Select
                  value={selectedCrop}
                  onValueChange={(value) => setSelectedCrop(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Crops</SelectItem>
                    {uniqueCrops.map((crop) => (
                      <SelectItem key={crop} value={crop}>
                        {crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Price Category</Label>
                <Select
                  value={selectedPriceCategory}
                  onValueChange={(value) => setSelectedPriceCategory(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="affordable">Affordable</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Minimum Rating</Label>
                <div className="pt-2">
                  <Slider
                    value={[minRating]}
                    onValueChange={(value) => setMinRating(value[0])}
                    max={5}
                    step={0.5}
                    className="my-4"
                  />
                  <div className="flex justify-between">
                    {renderStars(minRating)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <ScrollArea className="h-[calc(100vh-6rem)]">
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <p>Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="flex items-center justify-center h-40">
                  <p>No fertilizer products found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredProducts().map((product) => {
                    const cards = [];
                    if (selectedPriceCategory === "all" || selectedPriceCategory === "affordable") {
                      cards.push(
                        <motion.div key={`${product.id}-low`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                          {renderProductCard(
                            product.low_cost_fertilizer,
                            product.low_cost_rating,
                            product.low_cost_buy_link,
                            product.low_cost_image,
                            "Affordable"
                          )}
                        </motion.div>
                      );
                    }
                    if (selectedPriceCategory === "all" || selectedPriceCategory === "moderate") {
                      cards.push(
                        <motion.div key={`${product.id}-medium`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                          {renderProductCard(
                            product.medium_cost_fertilizer,
                            product.medium_cost_rating,
                            product.medium_cost_buy_link,
                            product.medium_cost_image,
                            "Moderate"
                          )}
                        </motion.div>
                      );
                    }
                    if (selectedPriceCategory === "all" || selectedPriceCategory === "premium") {
                      cards.push(
                        <motion.div key={`${product.id}-high`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                          {renderProductCard(
                            product.high_cost_fertilizer,
                            product.high_cost_rating,
                            product.high_cost_buy_link,
                            product.high_cost_image,
                            "Premium"
                          )}
                        </motion.div>
                      );
                    }
                    return cards;
                  }).flat()}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FertilizerGuide;
