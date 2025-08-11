
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCompanyId } from "@/hooks/useCompanyId";
import ErrorHandler from "@/components/ErrorHandler";

export default function SmartOpsPanel() {
  const companyId = useCompanyId();
  const [error, setError] = useState<any>(null);

  const { data, isLoading, error: queryError, refetch } = useQuery({
    queryKey: ['smartops', companyId],
    queryFn: async () => {
      setError(null);
      
      if (!companyId) {
        throw new Error('Company ID is required for SmartOps analysis');
      }

      try {
        const { data, error } = await supabase.functions.invoke("smartops", {
          body: { companyId },
        });

        if (error) {
          console.error("SmartOps error:", error);
          throw error;
        }

        return data;
      } catch (e) {
        setError(e);
        throw e;
      }
    },
    enabled: !!companyId,
    refetchInterval: 300000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || queryError) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-3">SmartOps Analysis</h3>
        <ErrorHandler 
          error={error || queryError} 
          context="SmartOps Panel"
          onRetry={() => refetch()}
          showApiKeyPrompt={true}
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-3">SmartOps Analysis</h3>
        <p className="text-text-secondary">No data available. Please check your company settings.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3">SmartOps Analysis</h3>
      
      {data.kpis && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{data.kpis.overdueCount}</div>
            <div className="text-xs text-text-secondary">Overdue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">£{data.kpis.unpaidTotal?.toFixed(0) || '0'}</div>
            <div className="text-xs text-text-secondary">Unpaid</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">£{data.kpis.expensesNext30?.toFixed(0) || '0'}</div>
            <div className="text-xs text-text-secondary">Next 30d</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{data.kpis.tendersCount || 0}</div>
            <div className="text-xs text-text-secondary">Tenders</div>
          </div>
        </div>
      )}

      {data.suggestions && (
        <div className="space-y-2">
          <h4 className="font-medium">Recommendations:</h4>
          <ul className="text-sm space-y-1">
            {data.suggestions.map((suggestion: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.aiAdvice && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <h4 className="font-medium text-blue-800 mb-2">AI Insights:</h4>
          <p className="text-sm text-blue-700 whitespace-pre-line">{data.aiAdvice}</p>
        </div>
      )}
    </div>
  );
}
