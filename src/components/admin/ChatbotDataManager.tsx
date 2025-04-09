
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertCircle, Database, Loader2, RefreshCw, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const knowledgeFormSchema = z.object({
  keywords: z.string().min(3, "Keywords are required"),
  response_en: z.string().min(10, "English response is required"),
  response_hi: z.string().optional(),
  response_te: z.string().optional(),
  response_kn: z.string().optional(),
  response_ml: z.string().optional(),
  source: z.string().optional(),
  content: z.string().optional(),
});

type KnowledgeFormValues = z.infer<typeof knowledgeFormSchema>;

// Update the interface to match the table schema
interface KnowledgeItem {
  id: string;
  keywords: string;
  response_en: string;
  response_hi?: string | null;
  response_te?: string | null;
  response_kn?: string | null;
  response_ml?: string | null;
  source?: string | null;
  content?: string | null;
  created_at: string;
}

const ChatbotDataManager = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingBucket, setIsCreatingBucket] = useState(false);
  const [bucketExists, setBucketExists] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState("");
  
  const { toast } = useToast();
  
  const form = useForm<KnowledgeFormValues>({
    resolver: zodResolver(knowledgeFormSchema),
    defaultValues: {
      keywords: "",
      response_en: "",
      response_hi: "",
      response_te: "",
      response_kn: "",
      response_ml: "",
      source: "",
      content: "",
    },
  });
  
  // Check if bucket exists on component mount
  useEffect(() => {
    checkBucketExists();
    fetchKnowledgeItems();
  }, []);
  
  const checkBucketExists = async () => {
    try {
      setError(null);
      const { data: buckets } = await supabase.storage.listBuckets();
      const exists = buckets?.some(bucket => bucket.name === 'chatbot_data');
      setBucketExists(exists);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error checking bucket:", error);
      setError("Could not check if storage bucket exists: " + error.message);
      setIsLoading(false);
    }
  };
  
  const createBucket = async () => {
    try {
      setIsCreatingBucket(true);
      setError(null);
      
      const { data, error } = await supabase.functions.invoke('chatbot-data', {
        body: { action: 'create_bucket' }
      });
      
      if (error) throw error;
      
      setBucketExists(true);
      toast({
        title: "Success",
        description: "Chatbot data storage bucket created successfully",
      });
    } catch (error: any) {
      console.error("Error creating bucket:", error);
      setError("Could not create storage bucket: " + error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not create storage bucket",
      });
    } finally {
      setIsCreatingBucket(false);
    }
  };
  
  const fetchKnowledgeItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('agricultural_knowledge')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Add type assertion to handle the response data type
      setKnowledgeItems(data as KnowledgeItem[] || []);
    } catch (error: any) {
      console.error("Error fetching knowledge items:", error);
      setError("Could not fetch agricultural knowledge data: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Read file content for text files
      if (file.type === 'text/plain' || file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setFileContent(event.target.result as string);
            form.setValue('content', event.target.result as string);
          }
        };
        reader.readAsText(file);
      }
    }
  };
  
  const onSubmit = async (values: KnowledgeFormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const { data, error } = await supabase.functions.invoke('chatbot-data', {
        body: { 
          action: 'add_knowledge',
          ...values
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Knowledge item added successfully",
      });
      
      // Reset form
      form.reset();
      setSelectedFile(null);
      setFileContent("");
      
      // Refresh knowledge items
      fetchKnowledgeItems();
    } catch (error: any) {
      console.error("Error adding knowledge:", error);
      setError("Could not add knowledge item: " + error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not add knowledge item",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Chatbot Knowledge Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!bucketExists && (
            <div className="mb-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Storage bucket not found</AlertTitle>
                <AlertDescription>
                  A storage bucket is needed to upload files for the chatbot.
                </AlertDescription>
              </Alert>
              <Button 
                onClick={createBucket} 
                className="mt-4"
                disabled={isCreatingBucket}
              >
                {isCreatingBucket && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Storage Bucket
              </Button>
            </div>
          )}
          
          <Tabs defaultValue="add">
            <TabsList className="mb-4">
              <TabsTrigger value="add">Add Knowledge</TabsTrigger>
              <TabsTrigger value="view">View Knowledge Base</TabsTrigger>
            </TabsList>
            
            <TabsContent value="add">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="keywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Keywords (comma-separated)</FormLabel>
                          <FormControl>
                            <Input placeholder="rice, paddy, cultivation" {...field} />
                          </FormControl>
                          <FormDescription>
                            Used to match user queries
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="source"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Source (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Agricultural Ministry Guidelines" {...field} />
                          </FormControl>
                          <FormDescription>
                            Source of this information
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium mb-2">Responses in Different Languages</h3>
                    
                    <FormField
                      control={form.control}
                      name="response_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>English Response</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Information about rice cultivation..." 
                              className="min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="response_hi"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hindi Response (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Hindi translation..." 
                                className="min-h-[100px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="response_te"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telugu Response (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Telugu translation..." 
                                className="min-h-[100px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="response_kn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kannada Response (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Kannada translation..." 
                                className="min-h-[100px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="response_ml"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Malayalam Response (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Malayalam translation..." 
                                className="min-h-[100px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium mb-2">Additional Content</h3>
                    
                    <div className="mb-4">
                      <FormLabel htmlFor="file-upload">Upload Text File (Optional)</FormLabel>
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".txt,.json"
                        onChange={handleFileChange}
                      />
                      {selectedFile && (
                        <p className="text-sm mt-2">
                          Selected file: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                        </p>
                      )}
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Raw Content (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any additional content..." 
                              className="min-h-[150px]" 
                              {...field} 
                              value={field.value || fileContent}
                            />
                          </FormControl>
                          <FormDescription>
                            Full text content or additional details
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add to Knowledge Base
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="view">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Knowledge Base Items</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchKnowledgeItems}
                  disabled={isLoading}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
              
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : knowledgeItems.length > 0 ? (
                <div className="border rounded-md overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Keywords</TableHead>
                        <TableHead>Response (English)</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Added</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {knowledgeItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.keywords}</TableCell>
                          <TableCell className="max-w-[300px] truncate">
                            {item.response_en}
                          </TableCell>
                          <TableCell>{item.source || "-"}</TableCell>
                          <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-8 border rounded-md bg-muted/50">
                  <p>No knowledge items found. Add your first item.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotDataManager;
