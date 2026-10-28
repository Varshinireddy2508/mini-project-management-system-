import React from 'react';
import { FolderKanban, PlusCircle, RefreshCw } from 'lucide-react';

export default function Navbar({ onOpenAddModal, onRefresh, isRefreshing }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon-wrapper">
            <FolderKanban className="brand-icon" size={26} />
          </div>
          <div>
            <h1 className="brand-title">Mini Project Management System</h1>
            <p className="brand-subtitle">Student Project Tracker & Milestone Monitor</p>
          </div>
        </div>

        <div className="navbar-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh project list"
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
            <span className="btn-text">Refresh</span>
          </button>
          
          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenAddModal}
          >
            <PlusCircle size={18} />
            <span className="btn-text">Add Project</span>
          </button>
        </div>
      </div>
    </header>
  );
}
