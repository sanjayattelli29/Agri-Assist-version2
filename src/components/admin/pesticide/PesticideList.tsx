
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import ProductsTable from "@/components/admin/ProductsTable";

type PesticideProduct = Tables<"pesticide_products">;

const PesticideList = () => {
  const [pesticideProducts, setPesticideProducts] = useState<PesticideProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchPesticideProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("pesticide_products")
        .select("*")
        .order("crop_name", { ascending: true });

      if (error) throw error;
      setPesticideProducts(data || []);
    } catch (error) {
      console.error("Error fetching pesticide products:", error);
      toast({
        variant: "destructive",
        title: "Error fetching data",
        description: "Could not load pesticide products",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPesticideProducts();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Pesticide Products</CardTitle>
        <Button variant="outline" onClick={fetchPesticideProducts} disabled={loading}>
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <ProductsTable 
          products={pesticideProducts} 
          type="pesticide" 
          loading={loading} 
        />
      </CardContent>
    </Card>
  );
};

export default PesticideList;
