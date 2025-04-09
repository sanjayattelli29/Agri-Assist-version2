
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import ProductsTable from "@/components/admin/ProductsTable";

type FertilizerProduct = Tables<"fertilizer_products">;

const FertilizerList = () => {
  const [fertilizerProducts, setFertilizerProducts] = useState<FertilizerProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchFertilizerProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("fertilizer_products")
        .select("*")
        .order("crop_name", { ascending: true });

      if (error) throw error;
      setFertilizerProducts(data || []);
    } catch (error) {
      console.error("Error fetching fertilizer products:", error);
      toast({
        variant: "destructive",
        title: "Error fetching data",
        description: "Could not load fertilizer products",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFertilizerProducts();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Fertilizer Products</CardTitle>
        <Button variant="outline" onClick={fetchFertilizerProducts} disabled={loading}>
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <ProductsTable 
          products={fertilizerProducts} 
          type="fertilizer" 
          loading={loading} 
        />
      </CardContent>
    </Card>
  );
};

export default FertilizerList;
