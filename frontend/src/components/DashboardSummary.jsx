import React from 'react';
import { Layers, Clock, Loader2, CheckCircle2 } from 'lucide-react';

export default function DashboardSummary({ counts, currentFilter, onFilterChange }) {
  const cards = [
    {
      id: 'ALL',
      title: 'Total Projects',
      count: counts.total,
      icon: Layers,
      colorClass: 'card-total',
      description: 'All recorded student projects',
    },
    {
      id: 'NOT_STARTED',
      title: 'Not Started',
      count: counts.notStarted,
      icon: Clock,
      colorClass: 'card-not-started',
      description: 'Awaiting development kickoff',
    },
    {
      id: 'IN_PROGRESS',
      title: 'In Progress',
      count: counts.inProgress,
      icon: Loader2,
      colorClass: 'card-in-progress',
      description: 'Actively in development',
    },
    {
      id: 'COMPLETED',
      title: 'Completed',
      count: counts.completed,
      icon: CheckCircle2,
      colorClass: 'card-completed',
      description: 'Finished & verified submissions',
    },
  ];

  return (
    <section className="dashboard-summary" aria-label="Project Statistics">
      <div className="summary-grid">
        {cards.map((card) => {
          const Icon = card.icon;
          const isActive = currentFilter === card.id;

          return (
            <div
              key={card.id}
              className={`summary-card ${card.colorClass} ${isActive ? 'active-filter-card' : ''}`}
              onClick={() => onFilterChange(card.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onFilterChange(card.id);
                }
              }}
              title={`Click to filter by ${card.title}`}
            >
              <div className="card-top">
                <span className="card-title">{card.title}</span>
                <div className="card-icon-bubble">
                  <Icon size={20} />
                </div>
              </div>
              <div className="card-count">{card.count}</div>
              <div className="card-footer">
                <span>{card.description}</span>
                {isActive && <span className="active-pill">Active Filter</span>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
