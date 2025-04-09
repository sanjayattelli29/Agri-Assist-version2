
import { CropRecommendation } from "./CropRecommendation";

interface AlternativeRecommendationsProps {
  recommendations: Array<{ crop: string; efficiency: number }>;
  t: Record<string, string>;
}

export const AlternativeRecommendations = ({ 
  recommendations, 
  t 
}: AlternativeRecommendationsProps) => {
  if (recommendations.length <= 1) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">{t.alternativeCrops}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.slice(1).map((rec, index) => (
          <CropRecommendation
            key={index}
            recommendation={rec}
            t={t}
          />
        ))}
      </div>
    </div>
  );
};
