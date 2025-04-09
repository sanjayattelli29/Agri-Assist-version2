
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface ProductData {
  id: number;
  crop_name: string;
  low_cost_fertilizer?: string;
  low_cost_pesticide?: string;
  low_cost_rating: number;
  low_cost_image: string | null;
  medium_cost_fertilizer?: string;
  medium_cost_pesticide?: string;
  medium_cost_rating: number;
  medium_cost_image: string | null;
  high_cost_fertilizer?: string;
  high_cost_pesticide?: string;
  high_cost_rating: number;
  high_cost_image: string | null;
}

interface ProductsTableProps {
  products: ProductData[];
  type: "fertilizer" | "pesticide";
  loading: boolean;
}

const ProductsTable = ({ products, type, loading }: ProductsTableProps) => {
  // Determine which field names to use based on type
  const lowCostField = type === "fertilizer" ? "low_cost_fertilizer" : "low_cost_pesticide";
  const mediumCostField = type === "fertilizer" ? "medium_cost_fertilizer" : "medium_cost_pesticide";
  const highCostField = type === "fertilizer" ? "high_cost_fertilizer" : "high_cost_pesticide";

  return (
    <div className="overflow-x-auto">
      {products.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Crop</TableHead>
              <TableHead>Low Cost Option</TableHead>
              <TableHead>Medium Cost Option</TableHead>
              <TableHead>High Cost Option</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.crop_name}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{product[lowCostField as keyof ProductData]}</div>
                    <div className="text-sm text-muted-foreground">Rating: {product.low_cost_rating}</div>
                    {product.low_cost_image && (
                      <div className="w-12 h-12 rounded-md overflow-hidden">
                        <img 
                          src={product.low_cost_image} 
                          alt={String(product[lowCostField as keyof ProductData])} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{product[mediumCostField as keyof ProductData]}</div>
                    <div className="text-sm text-muted-foreground">Rating: {product.medium_cost_rating}</div>
                    {product.medium_cost_image && (
                      <div className="w-12 h-12 rounded-md overflow-hidden">
                        <img 
                          src={product.medium_cost_image} 
                          alt={String(product[mediumCostField as keyof ProductData])} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{product[highCostField as keyof ProductData]}</div>
                    <div className="text-sm text-muted-foreground">Rating: {product.high_cost_rating}</div>
                    {product.high_cost_image && (
                      <div className="w-12 h-12 rounded-md overflow-hidden">
                        <img 
                          src={product.high_cost_image} 
                          alt={String(product[highCostField as keyof ProductData])} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-4">
          {loading ? "Loading..." : "No data found"}
        </div>
      )}
    </div>
  );
};

export default ProductsTable;
