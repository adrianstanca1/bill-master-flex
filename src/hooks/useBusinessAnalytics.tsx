import React from 'react';

export function useBusinessAnalytics() {
  return {
    metrics: [],
    insights: {},
    dashboardData: {},
    loading: false,
    error: null,
    refreshMetrics: () => {},
    addMetric: () => {},
  };
}