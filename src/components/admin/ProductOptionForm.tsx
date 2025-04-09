
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ImageUploadField from "./ImageUploadField";
import { UseFormReturn } from "react-hook-form";

interface ProductOptionFormProps {
  title: string;
  form: UseFormReturn<any>;
  nameField: string;
  ratingField: string;
  buyLinkField: string;
  imageField: string;
  bucketName: "pesticide_images" | "fertilizer_images";
}

const ProductOptionForm = ({
  title,
  form,
  nameField,
  ratingField,
  buyLinkField,
  imageField,
  bucketName,
}: ProductOptionFormProps) => {
  return (
    <div className="border p-4 rounded-md space-y-4">
      <h3 className="font-medium text-lg">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={nameField}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder={`${title} name`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={ratingField}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating (0-5)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={0} 
                  max={5} 
                  step={0.1} 
                  {...field}
                  onChange={e => field.onChange(parseFloat(e.target.value) || 0)} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={buyLinkField}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Buy Link</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/buy" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ImageUploadField
          label="Image"
          fieldName={imageField}
          bucketName={bucketName}
          form={form}
        />
      </div>
    </div>
  );
};

export default ProductOptionForm;
