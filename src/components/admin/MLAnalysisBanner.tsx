import React from "react";
import { BarChart, Workflow, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const AnalysisBanners = () => {
  return (
    <div className="space-y-6">
      {/* ML Analysis Banner */}
      <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border border-green-100 dark:border-green-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-2">ML Analysis</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              Ready to perform advanced machine learning analysis for farmers? Access our comprehensive analytical tools to gain deeper insights into crop data, soil conditions, and yield predictions.
            </p>
          </div>
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-600 shadow-md">
            <a
              href="https://agri-analysis-app-models.streamlit.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <BarChart className="h-5 w-5" />
              Open Analysis Tool
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      {/* Extreme UML Analysis Banner */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-100 dark:border-blue-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400 mb-2">Extreme UML Analysis</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              Dive deep into the feature architecture and workflow of the platform using UML diagrams. Visualize how each component interacts, flows, and supports your crop management journey.
            </p>
          </div>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600 shadow-md">
            <a
              href="https://agri-assist-uml.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Workflow className="h-5 w-5" />
              View UML Analysis
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisBanners;
