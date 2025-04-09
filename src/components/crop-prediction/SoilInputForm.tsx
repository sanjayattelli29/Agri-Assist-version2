
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SoilInputFormProps {
  formData: {
    nitrogen: string;
    phosphorus: string;
    potassium: string;
    ph: string;
    rainfall: string;
  };
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
  t: Record<string, string>;
}

export const SoilInputForm = ({
  formData,
  onSubmit,
  onChange,
  isSubmitting,
  t,
}: SoilInputFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <Card className="dark:bg-gray-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">{t.soilParametersHeading}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nitrogen" className="text-sm font-medium">
                {t.nitrogenLabel}
              </Label>
              <Input
                id="nitrogen"
                name="nitrogen"
                type="number"
                placeholder={t.nitrogenPlaceholder}
                value={formData.nitrogen}
                onChange={onChange}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phosphorus" className="text-sm font-medium">
                {t.phosphorusLabel}
              </Label>
              <Input
                id="phosphorus"
                name="phosphorus"
                type="number"
                placeholder={t.phosphorusPlaceholder}
                value={formData.phosphorus}
                onChange={onChange}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="potassium" className="text-sm font-medium">
                {t.potassiumLabel}
              </Label>
              <Input
                id="potassium"
                name="potassium"
                type="number"
                placeholder={t.potassiumPlaceholder}
                value={formData.potassium}
                onChange={onChange}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ph" className="text-sm font-medium">
                {t.phLabel}
              </Label>
              <Input
                id="ph"
                name="ph"
                type="number"
                step="0.1"
                min="0"
                max="14"
                placeholder={t.phPlaceholder}
                value={formData.ph}
                onChange={onChange}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rainfall" className="text-sm font-medium">
                {t.rainfallLabel}
              </Label>
              <Input
                id="rainfall"
                name="rainfall"
                type="number"
                placeholder={t.rainfallPlaceholder}
                value={formData.rainfall}
                onChange={onChange}
                required
                className="w-full"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  {t.submitting || "Processing..."}
                </span>
              ) : (
                t.submitButton
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
