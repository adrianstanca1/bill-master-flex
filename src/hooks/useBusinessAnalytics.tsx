import React from 'react';

export function useBusinessAnalytics() {
  return {
    metrics: [],
    loading: false,
    error: null,
    refreshMetrics: () => {},
    addMetric: () => {},
  };
}