import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Label } from "@/components/ui/label";
import { PlusCircle, Upload } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CropImageUploader from "@/components/admin/CropImageUploader";
import { useLanguage } from "@/contexts/LanguageContext";

type CropTrainingData = Tables<"crop_training_data">;
type CropTrainingDataInsert = Omit<CropTrainingData, "id" | "created_at">;

// Form schema for individual crop data entry
const cropFormSchema = z.object({
  nitrogen: z.coerce.number().min(0, "Nitrogen must be a positive number"),
  phosphorus: z.coerce.number().min(0, "Phosphorus must be a positive number"),
  potassium: z.coerce.number().min(0, "Potassium must be a positive number"),
  temperature: z.coerce.number(),
  humidity: z.coerce.number().min(0).max(100, "Humidity must be between 0 and 100"),
  ph: z.coerce.number().min(0).max(14, "pH must be between 0 and 14"),
  rainfall: z.coerce.number().min(0, "Rainfall must be a positive number"),
  label: z.string().min(1, "Crop name is required"),
});

type CropFormValues = z.infer<typeof cropFormSchema>;

const AdminCropPrediction = () => {
  const [cropData, setCropData] = useState<CropTrainingData[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t, language, getCropNameTranslation } = useLanguage();
  
  // Form for CSV upload
  const csvForm = useForm<{ csvData: string }>({
    resolver: zodResolver(z.object({
      csvData: z.string().min(1, "CSV data is required"),
    })),
    defaultValues: {
      csvData: "",
    },
  });
  
  // Form for individual crop data entry
  const cropForm = useForm<CropFormValues>({
    resolver: zodResolver(cropFormSchema),
    defaultValues: {
      nitrogen: 0,
      phosphorus: 0,
      potassium: 0,
      temperature: 25,
      humidity: 50,
      ph: 7,
      rainfall: 200,
      label: "",
    },
  });

  const fetchCropData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("crop_training_data")
        .select("*")
        .order("id", { ascending: true })
        .limit(10);

      if (error) throw error;
      setCropData(data || []);
    } catch (error) {
      console.error("Error fetching crop data:", error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("errorFetchingData"),
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCropData();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = event.target?.result as string;
      csvForm.setValue("csvData", csvData);
    };
    reader.readAsText(file);
  };

  const processCsvData = async (csvData: string) => {
    try {
      setLoading(true);
      
      // Parse CSV (assuming format: nitrogen,phosphorus,potassium,temperature,humidity,ph,rainfall,label)
      const rows = csvData.trim().split("\n");
      const headerRow = rows[0].split(",");
      
      // Simple validation - ensure we have all required columns
      const requiredColumns = ["nitrogen", "phosphorus", "potassium", "temperature", "humidity", "ph", "rainfall", "label"];
      const hasRequiredColumns = requiredColumns.every(col => headerRow.includes(col));
      
      if (!hasRequiredColumns) {
        throw new Error("CSV is missing required columns. Required columns: " + requiredColumns.join(", "));
      }
      
      // Create properly typed crop data objects
      const parsedData: CropTrainingDataInsert[] = [];
      
      for (const row of rows.slice(1)) {
        const values = row.split(",");
        const rowData: Record<string, any> = {};
        
        // Map CSV values to their proper columns
        headerRow.forEach((header, index) => {
          if (requiredColumns.includes(header)) {
            const value = values[index]?.trim();
            
            if (header === "label") {
              rowData[header] = value;
            } else if (value && !isNaN(parseFloat(value))) {
              rowData[header] = parseFloat(value);
            }
          }
        });
        
        // Check if all required fields are present and valid
        const isValid = requiredColumns.every(col => {
          if (col === "label") {
            return typeof rowData[col] === "string" && rowData[col].length > 0;
          } else {
            return typeof rowData[col] === "number" && !isNaN(rowData[col]);
          }
        });
        
        if (isValid) {
          // Now we can safely cast this as our required type
          parsedData.push({
            nitrogen: rowData.nitrogen,
            phosphorus: rowData.phosphorus,
            potassium: rowData.potassium,
            temperature: rowData.temperature,
            humidity: rowData.humidity,
            ph: rowData.ph,
            rainfall: rowData.rainfall,
            label: rowData.label,
          });
        }
      }
      
      if (parsedData.length === 0) {
        throw new Error("No valid data found in CSV");
      }
      
      // Insert data into Supabase
      const { error } = await supabase
        .from("crop_training_data")
        .insert(parsedData);
      
      if (error) throw error;
      
      toast({
        title: "Upload successful",
        description: `Uploaded ${parsedData.length} rows of crop data`,
      });
      
      // Refresh data
      fetchCropData();
      csvForm.reset();
      
    } catch (error: any) {
      console.error("Error processing CSV:", error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: error.message || "Could not process CSV data",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitCsv = (values: { csvData: string }) => {
    processCsvData(values.csvData);
  };

  const onSubmitCropData = async (values: CropFormValues) => {
    try {
      setLoading(true);
      
      // Create a properly typed crop entry object
      const cropEntry: CropTrainingDataInsert = {
        nitrogen: values.nitrogen,
        phosphorus: values.phosphorus,
        potassium: values.potassium,
        temperature: values.temperature,
        humidity: values.humidity,
        ph: values.ph,
        rainfall: values.rainfall,
        label: values.label,
      };
      
      // Insert the new crop data
      const { error } = await supabase
        .from("crop_training_data")
        .insert([cropEntry]);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Added data for ${values.label}`,
      });
      
      // Reset form and refresh data
      cropForm.reset();
      fetchCropData();
      
    } catch (error: any) {
      console.error("Error adding crop data:", error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: error.message || "Could not add crop data",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title={t("cropPredictionManagement")}>
      <Tabs defaultValue="individual">
        <TabsList className="mb-6">
          <TabsTrigger value="individual">{language === "en" ? "Individual Entry" : language === "hi" ? "व्यक्तिगत प्रविष्टि" : language === "te" ? "వ్యక్తిగత ఎంట్రీ" : language === "kn" ? "ವೈಯಕ್ತಿಕ ನಮೂದು" : "വ്യക്തിഗത എൻട്രി"}</TabsTrigger>
          <TabsTrigger value="csv">CSV {language === "en" ? "Upload" : language === "hi" ? "अपलोड" : language === "te" ? "అప్‌లోడ్" : language === "kn" ? "ಅಪ್‌ಲೋಡ್" : "അപ്‌ലോഡ്"}</TabsTrigger>
          <TabsTrigger value="images">{language === "en" ? "Crop Images" : language === "hi" ? "फसल छवियाँ" : language === "te" ? "పంట చిత్రాలు" : language === "kn" ? "ಬೆಳೆ ಚಿತ್ರಗಳು" : "വിള ചിത്രങ്ങൾ"}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="individual">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{language === "en" ? "Add Individual Crop Data" : language === "hi" ? "व्यक्तिगत फसल डेटा जोड़ें" : language === "te" ? "వ్యక్తిగత పంట డేటాను జోడించండి" : language === "kn" ? "ವೈಯಕ್ತಿಕ ಬೆಳೆ ಡೇಟಾವನ್ನು ಸೇರಿಸಿ" : "വ്യക്തിഗത വിള ഡാറ്റ ചേർക്കുക"}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...cropForm}>
                <form onSubmit={cropForm.handleSubmit(onSubmitCropData)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={cropForm.control}
                      name="label"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("cropName")}</FormLabel>
                          <FormControl>
                            <Input placeholder={language === "en" ? "e.g., rice, wheat, maize" : language === "hi" ? "जैसे, चावल, गेहूं, मक्का" : language === "te" ? "ఉదా., వరి, గోధుమ, మొక్కజొన్న" : language === "kn" ? "ಉದಾ., ಭತ್ತ, ಗೋಧಿ, ಮೆಕ್ಕೆಜೋಳ" : "ഉദാ., അരി, ഗോതമ്പ്, ചോളം"} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={cropForm.control}
                      name="nitrogen"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("nitrogen")}</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={cropForm.control}
                      name="phosphorus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("phosphorus")}</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={cropForm.control}
                      name="potassium"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("potassium")}</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={cropForm.control}
                      name="temperature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("temperature")}</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={cropForm.control}
                      name="humidity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("humidity")}</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={cropForm.control}
                      name="ph"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("ph")}</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={cropForm.control}
                      name="rainfall"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("rainfall")}</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (language === "en" ? "Saving..." : language === "hi" ? "सहेज रहे हैं..." : language === "te" ? "సేవ్ చేస్తోంది..." : language === "kn" ? "ಉಳಿಸಲಾಗುತ್ತಿದೆ..." : "സേവ് ചെയ്യുന്നു...") : (language === "en" ? "Save Crop Data" : language === "hi" ? "फसल डेटा सहेजें" : language === "te" ? "పంట డేటాను సేవ్ చేయండి" : language === "kn" ? "ಬೆಳೆ ಡೇಟಾವನ್ನು ಉಳಿಸಿ" : "വിള ഡാറ്റ സേവ് ചെയ്യുക")}
                    <PlusCircle className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="csv">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{language === "en" ? "Upload Crop Training Data" : language === "hi" ? "फसल प्रशिक्षण डेटा अपलोड करें" : language === "te" ? "పంట శిక్షణ డేటాను అప్‌లోడ్ చేయండి" : language === "kn" ? "ಬೆಳೆ ತರಬೇತಿ ಡೇಟಾವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ" : "വിള പരിശീലന ഡാറ്റ അപ്‌ലോഡ് ചെയ്യുക"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="file-upload">{language === "en" ? "Upload CSV File" : language === "hi" ? "CSV फ़ाइल अपलोड करें" : language === "te" ? "CSV ఫైల్‌ను అప్‌లోడ్ చేయండి" : language === "kn" ? "CSV ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ" : "CSV ഫയൽ അപ്‌ലോഡ് ചെയ്യുക"}</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === "en" ? "Format: nitrogen,phosphorus,potassium,temperature,humidity,ph,rainfall,label" : language === "hi" ? "प्रारूप: नाइट्रोजन,फॉस्फोरस,पोटैशियम,तापमान,आर्द्रता,पीएच,वर्षा,लेबल" : language === "te" ? "ఫార్మాట్: నైట్రోజన్,ఫాస్పరస్,పొటాషియం,ఉష్ణోగ్రత,తేమశాతం,పిహెచ్,వర్షపాతం,లేబుల్" : language === "kn" ? "ಸ್ವರೂಪ: ನೈಟ್ರೋಜನ್,ಫಾಸ್ಫರಸ್,ಪೊಟ್ಯಾಸಿಯಂ,ತಾಪಮಾನ,ಆರ್ದ್ರತೆ,ಪಿಹೆಚ್,ಮಳೆ,ಲೇಬಲ್" : "ഫോർമാറ്റ്: നൈട്രജൻ,ഫോസ്ഫറസ്,പൊട്ടാസ്യം,താപനില,ആർദ്രത,പിഎച്ച്,മഴ,ലേബൽ"}
                  </p>
                </div>

                <Form {...csvForm}>
                  <form onSubmit={csvForm.handleSubmit(onSubmitCsv)} className="space-y-4">
                    <FormField
                      control={csvForm.control}
                      name="csvData"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{language === "en" ? "Or paste CSV data" : language === "hi" ? "या CSV डेटा पेस्ट करें" : language === "te" ? "లేదా CSV డేటాను పేస్ట్ చేయండి" : language === "kn" ? "ಅಥವಾ CSV ಡೇಟಾವನ್ನು ಅಂಟಿಸಿ" : "അല്ലെങ്കിൽ CSV ഡാറ്റ പേസ്റ്റ് ചെയ്യുക"}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={language === "en" ? "Paste CSV data here..." : language === "hi" ? "CSV डेटा यहां पेस्ट करें..." : language === "te" ? "CSV డేటాను ఇక్కడ పేస్ట్ చేయండి..." : language === "kn" ? "CSV ಡೇಟಾವನ್ನು ಇಲ್ಲಿ ಅಂಟಿಸಿ..." : "CSV ഡാറ്റ ഇവിടെ പേസ്റ്റ് ചെയ്യുക..."}
                              className="min-h-[200px] font-mono text-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? t("uploading") : t("upload")}
                      <Upload className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="images">
          <CropImageUploader />
        </TabsContent>

        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">{language === "en" ? "Recent Crop Prediction Data" : language === "hi" ? "हाल की फसल भविष्यवाणी डेटा" : language === "te" ? "ఇటీవలి పంట భవిష్యవాణి డేటా" : language === "kn" ? "ಇತ್ತೀಚಿನ ಬೆಳೆ ಭವಿಷ್ಯವಾಣಿ ಡೇಟಾ" : "സമീപകാല വിള പ്രവചന ഡാറ്റ"}</CardTitle>
            <Button variant="outline" onClick={fetchCropData} disabled={loading}>
              {t("refresh")}
            </Button>
          </CardHeader>
          <CardContent>
            {cropData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>{t("cropName")}</TableHead>
                    <TableHead>N</TableHead>
                    <TableHead>P</TableHead>
                    <TableHead>K</TableHead>
                    <TableHead>{t("temperature")}</TableHead>
                    <TableHead>{t("humidity")}</TableHead>
                    <TableHead>{t("ph")}</TableHead>
                    <TableHead>{t("rainfall")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cropData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{getCropNameTranslation(item.label)}</TableCell>
                      <TableCell>{item.nitrogen}</TableCell>
                      <TableCell>{item.phosphorus}</TableCell>
                      <TableCell>{item.potassium}</TableCell>
                      <TableCell>{item.temperature}</TableCell>
                      <TableCell>{item.humidity}</TableCell>
                      <TableCell>{item.ph}</TableCell>
                      <TableCell>{item.rainfall}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-4">
                {loading ? t("loading") : language === "en" ? "No data found" : language === "hi" ? "कोई डेटा नहीं मिला" : language === "te" ? "డేటా కనుగొనబడలేదు" : language === "kn" ? "ಯಾವುದೇ ಡೇಟಾ ಕಂಡುಬಂದಿಲ್ಲ" : "ഡാറ്റയൊന്നും കണ്ടെത്തിയില്ല"}
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminCropPrediction;
