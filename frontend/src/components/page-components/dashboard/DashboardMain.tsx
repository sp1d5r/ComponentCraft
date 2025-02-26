import React from 'react';
import { Button } from "../../shadcn/button";
import { Card } from "../../shadcn/card";
import { Plus, Layers, Sparkles, Image, Component, ArrowRight } from "lucide-react";
import { motion } from 'framer-motion';

export const DashboardMain: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-black dark:text-white">Welcome back</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Transform your designs into production-ready components</p>
        </div>
        <Button 
          className="w-full sm:w-auto bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
          onClick={() => {/* Handle new project */}}
        >
          <Plus className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">New Project</span>
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickActionCard
          icon={<Sparkles className="h-6 w-6 text-white dark:text-black" />}
          title="Start from Template"
          description="Choose from our curated collection of pre-built design systems"
          onClick={() => {/* Handle action */}}
        />

        <QuickActionCard
          icon={<Image className="h-6 w-6 text-white dark:text-black" />}
          title="Upload Designs"
          description="Extract components from your existing UI screenshots"
          onClick={() => {/* Handle action */}}
        />
      </div>

      {/* Recent Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-black dark:text-white">Recent Projects</h2>
          <Button variant="ghost" size="icon" className="sm:hidden">
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className="hidden sm:flex text-sm text-gray-500">
            View all
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <ProjectCard 
            name="Mobile Banking App"
            components={24}
            lastUpdated="2 hours ago"
            thumbnail="/project-thumbnail.jpg"
          />
          
          <NewProjectCard />
        </div>
      </div>

      {/* AI Processing Status - Simplified for mobile */}
      <Card className="p-4 sm:p-6 border border-gray-200 dark:border-neutral-800">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-t-black dark:border-t-white border-gray-200 dark:border-neutral-800 animate-spin" />
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-medium text-black dark:text-white truncate">AI Processing</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              Analyzing components for "Mobile Banking App"
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

interface ProjectCardProps {
  name: string;
  components: number;
  lastUpdated: string;
  thumbnail?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ name, components, lastUpdated, thumbnail }) => {
  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-neutral-800 hover:border-gray-400 dark:hover:border-neutral-600 transition-all duration-300">
      <div className="aspect-[4/3] bg-gray-100 dark:bg-neutral-900">
        {thumbnail ? (
          <img src={thumbnail} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Layers className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-black dark:text-white">{name}</h3>
        <div className="flex items-center justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Component className="h-4 w-4" />
            {components} components
          </div>
          <span>{lastUpdated}</span>
        </div>
      </div>
    </Card>
  );
};
// New component for Quick Action Cards
interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ icon, title, description, onClick }) => (
  <Card 
    className="p-4 sm:p-6 border border-gray-200 dark:border-neutral-800 hover:border-gray-400 dark:hover:border-neutral-600 transition-all duration-300 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex items-start gap-4 sm:gap-0 sm:justify-between">
      <div className="flex items-center sm:block gap-4 sm:gap-0 sm:space-y-2">
        <div className="h-10 w-10 sm:h-12 sm:w-12 bg-black dark:bg-white rounded-lg flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-medium text-black dark:text-white">{title}</h3>
          <p className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
      <ArrowRight className="hidden sm:block h-5 w-5 text-gray-400" />
    </div>
  </Card>
);

// New component for New Project Card
const NewProjectCard: React.FC = () => (
  <Card className="aspect-[4/3] flex items-center justify-center border border-dashed border-gray-200 dark:border-neutral-800 hover:border-gray-400 dark:hover:border-neutral-600 transition-all duration-300">
    <Button variant="ghost" className="flex flex-col gap-2">
      <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
      <span className="text-xs sm:text-sm text-gray-500">Create New Project</span>
    </Button>
  </Card>
);

