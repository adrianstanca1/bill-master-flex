import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from './useCompanyId';
import { useDashboardStats } from './useDashboardStats';
import { useProjectsData } from './useProjectsData';

export interface BusinessMetric {
  id: string;
  metric_type: string;
  metric_value: number;
  metric_date: string;
  metadata: any;
  created_at: string;
}

export interface BusinessInsights {
  revenueGrowth: number;
  projectEfficiency: number;
  budgetVariance: number;
  cashFlowHealth: number;
  teamUtilization: number;
  customerSatisfaction: number;
  profitMargin: number;
  projectDeliveryRate: number;
}

export const useBusinessAnalytics = () => {
  const companyId = useCompanyId();
  const queryClient = useQueryClient();
  const { totalRevenue, pendingInvoices, overdueAmount, activeProjects } = useDashboardStats();
  const { analytics: projectAnalytics } = useProjectsData();

  // Fetch business metrics
  const { data: metrics = [], isLoading } = useQuery({
    queryKey: ['business-analytics', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('business_analytics')
        .select('*')
        .eq('company_id', companyId)
        .order('metric_date', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as BusinessMetric[];
    },
    enabled: !!companyId,
  });

  // Record metric mutation
  const recordMetricMutation = useMutation({
    mutationFn: async ({ 
      metric_type, 
      metric_value, 
      metadata = {} 
    }: {
      metric_type: string;
      metric_value: number;
      metadata?: any;
    }) => {
      if (!companyId) throw new Error('No company ID');

      const { data, error } = await supabase
        .from('business_analytics')
        .insert({
          company_id: companyId,
          metric_type,
          metric_value,
          metadata,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-analytics', companyId] });
    },
  });

  // Calculate insights based on current data
  const calculateInsights = (): BusinessInsights => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7);
    
    // Get revenue metrics for growth calculation
    const currentRevenue = metrics
      .filter(m => m.metric_type === 'revenue' && m.metric_date.startsWith(currentMonth))
      .reduce((sum, m) => sum + m.metric_value, 0);
    
    const lastMonthRevenue = metrics
      .filter(m => m.metric_type === 'revenue' && m.metric_date.startsWith(lastMonth))
      .reduce((sum, m) => sum + m.metric_value, 0);

    const revenueGrowth = lastMonthRevenue > 0 
      ? ((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    // Project efficiency based on completed vs planned
    const projectEfficiency = projectAnalytics.totalProjects > 0 
      ? (projectAnalytics.completedProjects / projectAnalytics.totalProjects) * 100 
      : 0;

    // Budget variance
    const budgetVariance = projectAnalytics.totalBudget > 0 
      ? ((projectAnalytics.totalBudget - projectAnalytics.totalSpent) / projectAnalytics.totalBudget) * 100 
      : 0;

    // Cash flow health (based on receivables vs payables)
    const cashFlowHealth = totalRevenue > 0 
      ? Math.max(0, ((totalRevenue - overdueAmount) / totalRevenue) * 100) 
      : 0;

    // Team utilization (placeholder - would need timesheet data)
    const teamUtilization = 75; // Default value

    // Customer satisfaction (placeholder - would need feedback data)
    const customerSatisfaction = 85; // Default value

    // Profit margin
    const profitMargin = totalRevenue > 0 
      ? ((totalRevenue - projectAnalytics.totalSpent) / totalRevenue) * 100 
      : 0;

    // Project delivery rate
    const projectDeliveryRate = projectAnalytics.totalProjects > 0 
      ? ((projectAnalytics.completedProjects) / projectAnalytics.totalProjects) * 100 
      : 0;

    return {
      revenueGrowth,
      projectEfficiency,
      budgetVariance,
      cashFlowHealth,
      teamUtilization,
      customerSatisfaction,
      profitMargin,
      projectDeliveryRate,
    };
  };

  // Generate comprehensive dashboard data
  const getDashboardData = () => {
    const insights = calculateInsights();
    
    return {
      overview: {
        totalRevenue,
        activeProjects,
        pendingInvoices,
        overdueAmount,
        averageProjectHealth: projectAnalytics.averageHealthScore,
        totalBudget: projectAnalytics.totalBudget,
        totalSpent: projectAnalytics.totalSpent,
      },
      performance: {
        revenueGrowth: insights.revenueGrowth,
        projectEfficiency: insights.projectEfficiency,
        profitMargin: insights.profitMargin,
        deliveryRate: insights.projectDeliveryRate,
      },
      health: {
        cashFlow: insights.cashFlowHealth,
        budgetVariance: insights.budgetVariance,
        overdueProjects: projectAnalytics.overdueProjects,
        overdueMilestones: projectAnalytics.overdueMilestones,
      },
      trends: {
        monthly: metrics
          .filter(m => m.metric_type === 'revenue')
          .slice(0, 12)
          .reverse(),
        quarterly: calculateQuarterlyTrends(),
      },
    };
  };

  // Calculate quarterly trends
  const calculateQuarterlyTrends = () => {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const currentYear = new Date().getFullYear();
    
    return quarters.map(quarter => {
      const quarterMetrics = metrics.filter(m => {
        const date = new Date(m.metric_date);
        const q = Math.floor(date.getMonth() / 3) + 1;
        return date.getFullYear() === currentYear && `Q${q}` === quarter;
      });
      
      return {
        quarter,
        revenue: quarterMetrics
          .filter(m => m.metric_type === 'revenue')
          .reduce((sum, m) => sum + m.metric_value, 0),
        projects: quarterMetrics
          .filter(m => m.metric_type === 'projects_completed')
          .reduce((sum, m) => sum + m.metric_value, 0),
      };
    });
  };

  // Auto-record metrics daily
  useEffect(() => {
    const recordDailyMetrics = async () => {
      if (!companyId) return;
      
      const today = new Date().toISOString().slice(0, 10);
      
      // Check if we already recorded today's metrics
      const existingMetrics = metrics.filter(m => m.metric_date === today);
      if (existingMetrics.length > 0) return;

      // Record key daily metrics
      const dailyMetrics = [
        { metric_type: 'revenue', metric_value: totalRevenue },
        { metric_type: 'active_projects', metric_value: activeProjects },
        { metric_type: 'pending_invoices', metric_value: pendingInvoices },
        { metric_type: 'overdue_amount', metric_value: overdueAmount },
        { metric_type: 'project_health_avg', metric_value: projectAnalytics.averageHealthScore },
      ];

      for (const metric of dailyMetrics) {
        recordMetricMutation.mutate(metric);
      }
    };

    recordDailyMetrics();
  }, [
    companyId,
    totalRevenue,
    activeProjects,
    pendingInvoices,
    overdueAmount,
    metrics,
    projectAnalytics.averageHealthScore,
    recordMetricMutation,
  ]);

  return {
    metrics,
    insights: calculateInsights(),
    dashboardData: getDashboardData(),
    isLoading,
    recordMetric: recordMetricMutation.mutate,
    isRecordingMetric: recordMetricMutation.isPending,
  };
};