export function useProjectsData() {
  return {
    projects: [],
    projectsWithHealth: [],
    loading: false,
    error: null,
    refetch: () => {}
  };
}