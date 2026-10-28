import React from 'react';
import { Edit2, Trash2, Calendar, AlertCircle, PlusCircle, Clock, CheckCircle2, Loader2, FolderKanban } from 'lucide-react';

export default function ProjectList({
  projects,
  isLoading,
  error,
  currentFilter,
  onEdit,
  onDelete,
  onOpenAddModal,
  onRetry,
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'NOT_STARTED':
        return (
          <span className="badge badge-not-started">
            <Clock size={12} />
            <span>Not Started</span>
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="badge badge-in-progress">
            <Loader2 size={12} className="spin-slow" />
            <span>In Progress</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="badge badge-completed">
            <CheckCircle2 size={12} />
            <span>Completed</span>
          </span>
        );
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const [year, month, day] = dateString.split('-');
      if (!year || !month || !day) return dateString;
      const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="state-container">
        <div className="spinner"></div>
        <p className="state-title">Loading projects from MySQL database...</p>
        <p className="state-subtitle">Please wait while the project records are retrieved.</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="state-container error-state">
        <div className="state-icon-wrapper error-icon-bg">
          <AlertCircle size={32} className="text-danger" />
        </div>
        <h3 className="state-title">Backend / Database Unavailable</h3>
        <p className="state-subtitle">{error}</p>
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          Retry Connection
        </button>
      </div>
    );
  }

  // Empty state
  if (!projects || projects.length === 0) {
    return (
      <div className="state-container">
        <div className="state-icon-wrapper">
          <FolderKanban size={32} className="text-muted" />
        </div>
        <h3 className="state-title">
          {currentFilter === 'ALL'
            ? 'No projects recorded yet'
            : `No projects with status "${currentFilter.replace('_', ' ').toLowerCase()}"`}
        </h3>
        <p className="state-subtitle">
          {currentFilter === 'ALL'
            ? 'Get started by creating your first software project record.'
            : 'Try changing the status filter or create a new project.'}
        </p>
        {currentFilter === 'ALL' && (
          <button type="button" className="btn btn-primary" onClick={onOpenAddModal}>
            <PlusCircle size={18} />
            <span>Add Your First Project</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="project-list-wrapper">
      {/* Desktop / Tablet Table View */}
      <div className="table-container">
        <table className="project-table">
          <thead>
            <tr>
              <th className="col-id">ID</th>
              <th className="col-name">Project Name & Description</th>
              <th className="col-date">Start Date</th>
              <th className="col-date">Deadline</th>
              <th className="col-status">Status</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="table-row">
                <td className="col-id">
                  <span className="id-badge">#{project.id}</span>
                </td>
                <td className="col-name">
                  <div className="project-name-cell">
                    <span className="project-name-text">{project.name}</span>
                    <p className="project-desc-text">{project.description}</p>
                  </div>
                </td>
                <td className="col-date">
                  <div className="date-cell">
                    <Calendar size={14} className="text-muted" />
                    <span>{formatDate(project.startDate)}</span>
                  </div>
                </td>
                <td className="col-date">
                  <div className="date-cell">
                    <Calendar size={14} className="text-muted" />
                    <span className="deadline-text">{formatDate(project.deadline)}</span>
                  </div>
                </td>
                <td className="col-status">{getStatusBadge(project.status)}</td>
                <td className="col-actions">
                  <div className="action-buttons">
                    <button
                      type="button"
                      className="btn-icon btn-icon-edit"
                      onClick={() => onEdit(project)}
                      title={`Edit "${project.name}"`}
                      aria-label={`Edit ${project.name}`}
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      type="button"
                      className="btn-icon btn-icon-delete"
                      onClick={() => onDelete(project)}
                      title={`Delete "${project.name}"`}
                      aria-label={`Delete ${project.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="mobile-cards">
        {projects.map((project) => (
          <div key={project.id} className="mobile-project-card">
            <div className="mobile-card-header">
              <span className="id-badge">#{project.id}</span>
              {getStatusBadge(project.status)}
            </div>
            <h4 className="mobile-project-title">{project.name}</h4>
            <p className="mobile-project-desc">{project.description}</p>
            <div className="mobile-card-dates">
              <div className="mobile-date-item">
                <span className="mobile-date-label">Start:</span>
                <span>{formatDate(project.startDate)}</span>
              </div>
              <div className="mobile-date-item">
                <span className="mobile-date-label">Deadline:</span>
                <span className="deadline-text">{formatDate(project.deadline)}</span>
              </div>
            </div>
            <div className="mobile-card-actions">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => onEdit(project)}
              >
                <Edit2 size={14} />
                <span>Edit</span>
              </button>
              <button
                type="button"
                className="btn btn-danger-outline btn-sm"
                onClick={() => onDelete(project)}
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
