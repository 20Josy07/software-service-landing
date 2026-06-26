import React from 'react';

const SectionHeading = ({ eyebrow, title, description, light = false }) => (
  <div className="text-center mb-12 sm:mb-14">
    {eyebrow && (
      <p
        className={`text-xs font-bold uppercase tracking-widest mb-3 ${
          light ? 'text-cyber-400' : 'text-electric-300'
        }`}
      >
        {eyebrow}
      </p>
    )}
    <h2
      className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${
        light ? 'text-slate-100' : 'text-gradient'
      }`}
    >
      {title}
    </h2>
    {description && (
      <p className="mt-4 text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
        {description}
      </p>
    )}
  </div>
);

export default SectionHeading;
