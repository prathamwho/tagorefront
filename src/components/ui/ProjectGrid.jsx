import React from 'react';

const ProjectGrid = ({ projects }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
      {projects.map((project) => (
        <div 
          key={project.id} 
          className="group aspect-square flex flex-col border border-[#30363d] rounded-md bg-[#0d1117] hover:border-[#8b949e] transition-colors cursor-pointer overflow-hidden"
        >
          {/* Top 60%: Placeholder / Preview Area */}
          <div className="h-[60%] w-full bg-[#161b22] border-b border-[#30363d] flex items-center justify-center relative group-hover:bg-[#1c2128] transition-colors">
            {/* Visual Placeholder text (Remove later when you have images) */}
            <span className="text-[#30363d] font-mono text-xs select-none">
                PREVIEW
            </span>
            
            {/* Public Badge overlay */}
            <span className="absolute top-3 right-3 text-[10px] border border-[#30363d] text-[#8b949e] bg-[#0d1117] rounded-full px-2 py-0.5">
              {project.visibility}
            </span>
          </div>

          {/* Bottom 40%: Content Area */}
          <div className="h-[40%] p-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-[#58a6ff] text-sm mb-1 group-hover:underline truncate">
                {project.title}
              </h3>
              <p className="text-xs text-[#8b949e] line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Language / Meta */}
            <div className="flex items-center gap-3 text-xs text-[#8b949e] mt-2">
              {project.language_color && (
                <div className="flex items-center gap-1">
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: project.language_color }}
                  ></span>
                  <span>{project.tags[0]}</span>
                </div>
              )}
              <span>Updated {project.updated_at}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectGrid;