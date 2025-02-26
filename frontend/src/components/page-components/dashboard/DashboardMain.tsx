import React from 'react';
import { Button } from "../../shadcn/button";
import { Card } from "../../shadcn/card";
import { Plus, Layers, Sparkles, Image, Component, ArrowRight } from "lucide-react";
import { motion } from 'framer-motion';

export const DashboardMain: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-light text-black dark:text-white">Welcome back</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Transform your designs into production-ready components</p>
        </div>
        <Button 
          className="bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
          onClick={() => {/* Handle new project */}}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 border border-gray-200 dark:border-neutral-800 hover:border-gray-400 dark:hover:border-neutral-600 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-12 w-12 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white dark:text-black" />
              </div>
              <h3 className="text-lg font-medium text-black dark:text-white">Start from Template</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose from our curated collection of pre-built design systems
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>
        </Card>

        <Card className="p-6 border border-gray-200 dark:border-neutral-800 hover:border-gray-400 dark:hover:border-neutral-600 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-12 w-12 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <Image className="h-6 w-6 text-white dark:text-black" />
              </div>
              <h3 className="text-lg font-medium text-black dark:text-white">Upload Designs</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Extract components from your existing UI screenshots
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>
        </Card>
      </div>

      {/* Recent Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-black dark:text-white">Recent Projects</h2>
          <Button variant="ghost" className="text-sm text-gray-500">View all</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Example Project Card */}
          <ProjectCard 
            name="Mobile Banking App"
            components={24}
            lastUpdated="2 hours ago"
            thumbnail="/project-thumbnail.jpg"
          />
          
          {/* New Project Card */}
          <Card className="aspect-[4/3] flex items-center justify-center border border-dashed border-gray-200 dark:border-neutral-800 hover:border-gray-400 dark:hover:border-neutral-600 transition-all duration-300">
            <Button variant="ghost" className="flex flex-col gap-2">
              <Plus className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-500">Create New Project</span>
            </Button>
          </Card>
        </div>
      </div>

      {/* AI Processing Status */}
      <Card className="p-6 border border-gray-200 dark:border-neutral-800">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full border-2 border-t-black dark:border-t-white border-gray-200 dark:border-neutral-800 animate-spin" />
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white">AI Processing</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Analyzing components and generating design system for "Mobile Banking App"
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
