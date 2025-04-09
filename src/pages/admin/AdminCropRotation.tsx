
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Save } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";

type CropRotationRule = Tables<"crop_rotation_rules">;

const formSchema = z.object({
  current_crop: z.string().min(1, "Current crop is required"),
  next_crop: z.string().min(1, "Next crop is required"),
  rotation_months: z.number().int().min(1, "Rotation months must be at least 1"),
  benefits: z.string().optional(),
  notes: z.string().optional(),
});

const AdminCropRotation = () => {
  const [rotationRules, setRotationRules] = useState<CropRotationRule[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      current_crop: "",
      next_crop: "",
      rotation_months: 1,
      benefits: "",
      notes: "",
    },
  });

  const fetchRotationRules = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("crop_rotation_rules")
        .select("*")
        .order("current_crop", { ascending: true });

      if (error) throw error;
      setRotationRules(data || []);
    } catch (error) {
      console.error("Error fetching rotation rules:", error);
      toast({
        variant: "destructive",
        title: "Error fetching data",
        description: "Could not load crop rotation rules",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRotationRules();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      // Type cast the values to ensure they match the required type
      const dataToInsert = {
        current_crop: values.current_crop,
        next_crop: values.next_crop,
        rotation_months: values.rotation_months,
        benefits: values.benefits || null,
        notes: values.notes || null,
      };
      
      const { error } = await supabase
        .from("crop_rotation_rules")
        .insert(dataToInsert);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Crop rotation rule added successfully`,
      });
      form.reset();
      fetchRotationRules();
    } catch (error: any) {
      console.error("Error adding rotation rule:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Could not add crop rotation rule",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Crop Rotation Management">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Add Crop Rotation Rule</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="current_crop"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Crop</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Rice" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="next_crop"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Next Crop</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Wheat" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="rotation_months"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rotation Months</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1}
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 1)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="benefits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Benefits</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the benefits of this rotation"
                          className="resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Additional notes about this rotation"
                          className="resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={loading} className="w-full">
                  <Save className="mr-2 h-4 w-4" /> Save Rotation Rule
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Crop Rotation Rules</CardTitle>
            <Button variant="outline" onClick={fetchRotationRules} disabled={loading}>
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {rotationRules.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Current Crop</TableHead>
                    <TableHead>Next Crop</TableHead>
                    <TableHead>Rotation Months</TableHead>
                    <TableHead>Benefits</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rotationRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.current_crop}</TableCell>
                      <TableCell>{rule.next_crop}</TableCell>
                      <TableCell>{rule.rotation_months}</TableCell>
                      <TableCell>{rule.benefits}</TableCell>
                      <TableCell>{rule.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-4">
                {loading ? "Loading..." : "No data found"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCropRotation;
