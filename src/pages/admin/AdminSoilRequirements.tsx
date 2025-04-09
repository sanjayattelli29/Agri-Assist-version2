
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { PlusCircle, Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type SoilRequirements = Tables<"soil_requirements">;

const formSchema = z.object({
  crop_name: z.string().min(1, "Crop name is required"),
  nitrogen_min: z.number().int().min(0),
  nitrogen_max: z.number().int().min(0),
  phosphorus_min: z.number().int().min(0),
  phosphorus_max: z.number().int().min(0),
  potassium_min: z.number().int().min(0),
  potassium_max: z.number().int().min(0),
  temperature_min: z.number().min(0),
  temperature_max: z.number().min(0),
  humidity_min: z.number().min(0),
  humidity_max: z.number().min(0),
  ph_min: z.number().min(0),
  ph_max: z.number().min(0),
  rainfall_min: z.number().min(0),
  rainfall_max: z.number().min(0),
});

const AdminSoilRequirements = () => {
  const [soilData, setSoilData] = useState<SoilRequirements[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crop_name: "",
      nitrogen_min: 0,
      nitrogen_max: 0,
      phosphorus_min: 0,
      phosphorus_max: 0,
      potassium_min: 0,
      potassium_max: 0,
      temperature_min: 0,
      temperature_max: 0,
      humidity_min: 0,
      humidity_max: 0,
      ph_min: 0,
      ph_max: 0,
      rainfall_min: 0,
      rainfall_max: 0,
    },
  });

  const fetchSoilData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("soil_requirements")
        .select("*")
        .order("crop_name", { ascending: true });

      if (error) throw error;
      setSoilData(data || []);
    } catch (error) {
      console.error("Error fetching soil data:", error);
      toast({
        variant: "destructive",
        title: "Error fetching data",
        description: "Could not load soil requirements data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoilData();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      // Type cast the values to ensure they match the required type
      const dataToInsert = {
        crop_name: values.crop_name,
        nitrogen_min: values.nitrogen_min,
        nitrogen_max: values.nitrogen_max,
        phosphorus_min: values.phosphorus_min,
        phosphorus_max: values.phosphorus_max,
        potassium_min: values.potassium_min,
        potassium_max: values.potassium_max,
        temperature_min: values.temperature_min,
        temperature_max: values.temperature_max,
        humidity_min: values.humidity_min,
        humidity_max: values.humidity_max,
        ph_min: values.ph_min,
        ph_max: values.ph_max,
        rainfall_min: values.rainfall_min,
        rainfall_max: values.rainfall_max,
      };
      
      const { error } = await supabase
        .from("soil_requirements")
        .insert(dataToInsert);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Soil requirements for ${values.crop_name} added successfully`,
      });
      form.reset();
      fetchSoilData();
    } catch (error: any) {
      console.error("Error adding soil requirements:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Could not add soil requirements",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Soil Requirements Management">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Add Soil Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="crop_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crop Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Rice" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h3 className="font-medium">Nitrogen (N)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="nitrogen_min"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Min</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nitrogen_max"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Phosphorus (P)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phosphorus_min"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Min</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phosphorus_max"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Potassium (K)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="potassium_min"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Min</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="potassium_max"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Temperature</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="temperature_min"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Min</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="temperature_max"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Humidity</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="humidity_min"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Min</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="humidity_max"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">pH</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="ph_min"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Min</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ph_max"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Rainfall</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="rainfall_min"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Min</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="rainfall_max"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  <Save className="mr-2 h-4 w-4" /> Save Soil Requirements
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Soil Requirements Data</CardTitle>
            <Button variant="outline" onClick={fetchSoilData} disabled={loading}>
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {soilData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Crop</TableHead>
                      <TableHead>N (min-max)</TableHead>
                      <TableHead>P (min-max)</TableHead>
                      <TableHead>K (min-max)</TableHead>
                      <TableHead>Temp (min-max)</TableHead>
                      <TableHead>pH (min-max)</TableHead>
                      <TableHead>Rainfall (min-max)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {soilData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.crop_name}</TableCell>
                        <TableCell>{item.nitrogen_min}-{item.nitrogen_max}</TableCell>
                        <TableCell>{item.phosphorus_min}-{item.phosphorus_max}</TableCell>
                        <TableCell>{item.potassium_min}-{item.potassium_max}</TableCell>
                        <TableCell>{item.temperature_min}-{item.temperature_max}</TableCell>
                        <TableCell>{item.ph_min}-{item.ph_max}</TableCell>
                        <TableCell>{item.rainfall_min}-{item.rainfall_max}</TableCell>
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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSoilRequirements;
