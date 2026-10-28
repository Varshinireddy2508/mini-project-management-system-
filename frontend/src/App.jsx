import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import DashboardSummary from './components/DashboardSummary';
import StatusFilter from './components/StatusFilter';
import ProjectList from './components/ProjectList';
import ProjectModal from './components/ProjectModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import AlertBanner from './components/AlertBanner';
import { projectService } from './services/api';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('ALL');

  // Modals & form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notifications
  const [alert, setAlert] = useState(null);

  const showAlert = useCallback((type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  }, []);

  const fetchProjects = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);
    setError(null);

    try {
      const data = await projectService.getAllProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      const message =
        err.response?.data?.message ||
        err.message ||
        'Unable to connect to the backend REST API or MySQL database.';
      setError(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Derived Dashboard Summary Counts
  const counts = useMemo(() => {
    const total = projects.length;
    let notStarted = 0;
    let inProgress = 0;
    let completed = 0;

    projects.forEach((p) => {
      if (p.status === 'NOT_STARTED') notStarted++;
      else if (p.status === 'IN_PROGRESS') inProgress++;
      else if (p.status === 'COMPLETED') completed++;
    });

    return { total, notStarted, inProgress, completed };
  }, [projects]);

  // Filtered Project List (does not modify or delete original records)
  const filteredProjects = useMemo(() => {
    if (currentFilter === 'ALL') {
      return projects;
    }
    return projects.filter((p) => p.status === currentFilter);
  }, [projects, currentFilter]);

  // Handlers for Add & Edit
  const handleOpenAddModal = () => {
    setProjectToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProjectToEdit(null);
  };

  const handleSaveProject = async (projectData) => {
    setIsSubmitting(true);
    try {
      if (projectToEdit && projectToEdit.id) {
        // Update existing project
        const updated = await projectService.updateProject(projectToEdit.id, projectData);
        setProjects((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
        showAlert('success', `Project "${updated.name}" updated successfully.`);
      } else {
        // Create new project
        const created = await projectService.createProject(projectData);
        setProjects((prev) => [created, ...prev]);
        showAlert('success', `Project "${created.name}" created successfully.`);
      }
      handleCloseModal();
    } catch (err) {
      console.error('Error saving project:', err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.validationErrors
          ? Object.values(err.response.data.validationErrors).join(' ')
          : err.message || 'Failed to save project. Please verify inputs.';
      showAlert('error', errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handlers for Deletion
  const handleOpenDeleteModal = (project) => {
    setProjectToDelete(project);
  };

  const handleCloseDeleteModal = () => {
    setProjectToDelete(null);
  };

  const handleConfirmDelete = async (id) => {
    setIsDeleting(true);
    try {
      await projectService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showAlert('success', `Project #${id} was deleted successfully.`);
      handleCloseDeleteModal();
    } catch (err) {
      console.error('Error deleting project:', err);
      const errorMsg =
        err.response?.data?.message || err.message || 'Failed to delete project.';
      showAlert('error', errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Navigation Header */}
      <Navbar
        onOpenAddModal={handleOpenAddModal}
        onRefresh={() => fetchProjects(true)}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <main className="main-content">
        <div className="container">
          {/* Notification Toast */}
          <AlertBanner alert={alert} onDismiss={() => setAlert(null)} />

          {/* Dashboard Summary Cards */}
          <DashboardSummary
            counts={counts}
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
          />

          {/* Filter Bar & Controls */}
          <div className="controls-row">
            <StatusFilter
              currentFilter={currentFilter}
              onFilterChange={setCurrentFilter}
              counts={counts}
            />
          </div>

          {/* Project Listing Table / Cards */}
          <ProjectList
            projects={filteredProjects}
            isLoading={isLoading}
            error={error}
            currentFilter={currentFilter}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
            onOpenAddModal={handleOpenAddModal}
            onRetry={() => fetchProjects(false)}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <p>© 2026 Mini Project Management System • Full-Stack React + Spring Boot + MySQL</p>
          <div className="footer-status">
            <span className="status-dot"></span>
            <span>REST API Online</span>
          </div>
        </div>
      </footer>

      {/* Add / Edit Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProject}
        projectToEdit={projectToEdit}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(projectToDelete)}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        project={projectToDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
