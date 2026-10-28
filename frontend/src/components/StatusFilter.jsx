import React from 'react';

export default function StatusFilter({ currentFilter, onFilterChange, counts }) {
  const filters = [
    { id: 'ALL', label: 'All Projects', count: counts.total },
    { id: 'NOT_STARTED', label: 'Not Started', count: counts.notStarted },
    { id: 'IN_PROGRESS', label: 'In Progress', count: counts.inProgress },
    { id: 'COMPLETED', label: 'Completed', count: counts.completed },
  ];

  return (
    <div className="filter-bar">
      <div className="filter-group" role="tablist" aria-label="Filter projects by status">
        {filters.map((filter) => {
          const isSelected = currentFilter === filter.id;
          return (
            <button
              key={filter.id}
              role="tab"
              aria-selected={isSelected}
              className={`filter-btn ${isSelected ? 'active' : ''}`}
              onClick={() => onFilterChange(filter.id)}
            >
              <span>{filter.label}</span>
              <span className={`filter-badge ${isSelected ? 'badge-active' : ''}`}>
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
