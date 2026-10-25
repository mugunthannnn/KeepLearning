import React from 'react';

export const PageHeader = ({ title, subtitle, breadcrumbs = [], actions }) => {
  return (
    <div className="mb-6 pb-4 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span>/</span>}
                {b.link ? (
                  <a href={b.link} className="hover:text-slate-800 transition-colors">{b.label}</a>
                ) : (
                  <span className="font-medium text-slate-700">{b.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>

      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
};
