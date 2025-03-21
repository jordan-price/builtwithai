import React from 'react';
import { Link } from '@inertiajs/react';

export default function ProjectCard({ project }) {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg transition-all duration-200 hover:shadow-md">
      <Link href={route('projects.show', project.slug)}>
        {project.media && project.media.length > 0 ? (
          <div className="h-48 w-full overflow-hidden">
            <img 
              src={project.media[0].url} 
              alt={project.name} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <svg 
              className="w-16 h-16 text-gray-400 dark:text-gray-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
          </div>
        )}

        <div className="p-4">
          <div className="mb-2 flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              {project.category.name}
            </span>
            
            <div className="ml-auto flex items-center text-gray-500 dark:text-gray-400">
              <svg 
                className="w-4 h-4 mr-1" 
                fill="currentColor" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" 
                />
              </svg>
              <span className="text-xs">{project.stars_count}</span>
            </div>
          </div>
          
          <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white truncate">
            {project.name}
          </h3>
          
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {project.description}
          </p>
          
          <div className="mt-4 flex items-center">
            <div className="flex -space-x-2">
              {project.engineers.slice(0, 3).map(engineer => (
                <img 
                  key={engineer.id}
                  src={engineer.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(engineer.name)}&background=random`} 
                  alt={engineer.name}
                  className="w-6 h-6 rounded-full border border-white dark:border-gray-800" 
                />
              ))}
              
              {project.engineers.length > 3 && (
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 border border-white dark:border-gray-800">
                  +{project.engineers.length - 3}
                </div>
              )}
            </div>
            
            <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
              {new Date(project.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
