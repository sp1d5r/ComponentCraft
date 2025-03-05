import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/shadcn/button';
import { Card } from '../components/shadcn/card';
import { Upload, ArrowLeft, Plus, X, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Input } from '../components/shadcn/input';
import { Textarea } from '../components/shadcn/textarea';
import { ScrollArea } from '../components/shadcn/scroll-area';
import { 
  DesignTemplate, 
  ScreenFlow, 
  DetectedComponent 
} from 'shared';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableScreen } from '../components/page-components/new-project/SortableScreen';
import { FlowBuilder } from '../components/page-components/new-project/FlowBuilder';
import { ComponentDetectionPreview } from '../components/page-components/new-project/ComponentDetectionPreview';

type CreationStep = 
  | 'selection'      // Initial choice
  | 'template'       // Template gallery
  | 'template-customize' // Template customization
  | 'upload'         // Upload screens
  | 'organization'   // Organize flows
  | 'detection'      // Component detection
  | 'review'         // Review & finalize
  | 'complete';      // Project created

interface UploadedScreen {
  id: string;
  name: string;
  url: string;
  order: number;
}

interface ProjectData {
  name: string;
  description?: string;
  template?: DesignTemplate;
  screens: UploadedScreen[];
  flows: ScreenFlow[];
  detectedComponents: DetectedComponent[];
}

// Add these functions before the component
const mockDetectedComponents: Record<string, DetectedComponent[]> = {};

const getDetectedComponents = (screenId: string): DetectedComponent[] => {
  // Mock component detection - in reality this would come from an API
  if (mockDetectedComponents[screenId]) {
    return mockDetectedComponents[screenId];
  }

  const components: DetectedComponent[] = [
    {
      id: `button-${screenId}`,
      name: 'Primary Button',
      type: 'button',
      boundingBox: {
        x: 20,
        y: 30,
        width: 15,
        height: 8
      },
      confidence: 0.95,
      screenId,
      preview: '/mock-component.png',
      similarComponents: []
    },
    {
      id: `card-${screenId}`,
      name: 'Content Card',
      type: 'card',
      boundingBox: {
        x: 10,
        y: 45,
        width: 80,
        height: 30
      },
      confidence: 0.88,
      screenId,
      preview: '/mock-component.png',
      similarComponents: []
    }
  ];

  mockDetectedComponents[screenId] = components;
  return components;
};

// Move these inside the component
const [detectedComponents, setDetectedComponents] = useState<DetectedComponent[]>([]);

const handleComponentSelect = (component: DetectedComponent, approved: boolean) => {
  setDetectedComponents(prev => [
    ...prev.filter(c => c.id !== component.id),
    { ...component, approved }
  ]);
};

// Add this interface near the top with other interfaces
interface ScreenNode {
  id: string;
  screenId: string;
  position?: { x: number; y: number };
}

export const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<CreationStep>(() => {
    const stepParam = searchParams.get('step');
    if (stepParam && ['template', 'upload', 'organization'].includes(stepParam)) {
      return stepParam as CreationStep;
    }
    return 'selection';
  });
  const [uploadedScreens, setUploadedScreens] = useState<UploadedScreen[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    screens: [],
    flows: [],
    detectedComponents: []
  });
  const [flows, setFlows] = useState<ScreenFlow[]>([{
    id: 'main',
    name: 'Main Flow',
    description: 'Primary user journey',
    screens: [],
    connections: []
  }]);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    // Mock file upload - in reality, we'd upload to server and get URLs back
    const newScreens: UploadedScreen[] = Array.from(files).map((file, index) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      url: URL.createObjectURL(file),
      order: uploadedScreens.length + index
    }));
    
    setUploadedScreens([...uploadedScreens, ...newScreens]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const removeScreen = (id: string) => {
    setUploadedScreens(screens => screens.filter(s => s.id !== id));
  };

  // Add navigation handling
  const handleBack = () => {
    if (step === 'selection') {
      navigate('/dashboard');
    } else {
      setStep('selection');
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const newScreens = [...uploadedScreens];
      const activeIndex = newScreens.findIndex(s => s.id === active.id);
      const overIndex = newScreens.findIndex(s => s.id === over?.id);
      if (activeIndex !== -1 && overIndex !== -1) {
        const [removedScreen] = newScreens.splice(activeIndex, 1);
        newScreens.splice(overIndex, 0, removedScreen);
        setUploadedScreens(newScreens);
      }
    }
  };

  // Update the addScreenToFlow function
  const addScreenToFlow = (screenId: string, flowId: string) => {
    const newFlows = [...flows];
    const flowIndex = newFlows.findIndex(f => f.id === flowId);
    if (flowIndex !== -1) {
      const newScreenNode: ScreenNode = {
        id: Math.random().toString(36).substr(2, 9),
        screenId: screenId,
        position: { x: 0, y: 0 }
      };
      newFlows[flowIndex].screens = [...newFlows[flowIndex].screens, newScreenNode];
      setFlows(newFlows);
    }
  };

  const addNewFlow = () => {
    const newFlow: ScreenFlow = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Flow',
      description: '',
      screens: [],
      connections: []
    };
    setFlows([...flows, newFlow]);
  };

  const updateFlow = (flowId: string, updatedFlow: ScreenFlow) => {
    const newFlows = [...flows];
    const flowIndex = newFlows.findIndex(f => f.id === flowId);
    if (flowIndex !== -1) {
      newFlows[flowIndex] = updatedFlow;
      setFlows(newFlows);
    }
  };

  const deleteFlow = (flowId: string) => {
    const newFlows = flows.filter(f => f.id !== flowId);
    setFlows(newFlows);
  };

  const hasScreensInFlows = () => {
    return flows.some(f => f.screens.length > 0);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Progress Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-gray-100 dark:bg-neutral-900">
          <motion.div 
            className="h-full bg-black dark:bg-white"
            initial={{ width: "0%" }}
            animate={{ width: getProgressWidth(step) }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {step === 'selection' && (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h1 className="text-4xl font-light text-black dark:text-white">
                  Create New Project
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Choose how you'd like to start your design system
                </p>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <ProjectOptionCard
                    title="Start from Template"
                    description="Begin with our curated collection of pre-built design systems"
                    onClick={() => setStep('template')}
                  />
                  <ProjectOptionCard
                    title="Upload Designs"
                    description="Extract components from your existing UI screenshots"
                    onClick={() => setStep('upload')}
                  />
                </div>
              </motion.div>
            )}

            {step === 'template' && (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center gap-4">
                  <Button variant="ghost" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <h1 className="text-4xl font-light text-black dark:text-white">
                    Choose Template
                  </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-medium text-black dark:text-white">
                      Project Details
                    </h2>
                    <div className="space-y-2">
                      <Input
                        placeholder="Project Name"
                        value={projectData.name}
                        onChange={(e) => setProjectData({
                          ...projectData,
                          name: e.target.value
                        })}
                      />
                      <Textarea
                        placeholder="Project Description (optional)"
                        value={projectData.description || ''}
                        onChange={(e) => setProjectData({
                          ...projectData,
                          description: e.target.value
                        })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-medium text-black dark:text-white">
                      Templates
                    </h2>
                    <ScrollArea className="h-[400px] rounded-md border border-gray-200 dark:border-neutral-800">
                      <div className="p-4 space-y-4">
                        {templates.map((template) => (
                          <TemplateCard
                            key={template.id}
                            template={template}
                            isSelected={projectData.template?.id === template.id}
                            onSelect={() => setProjectData({
                              ...projectData,
                              template
                            })}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    className="bg-black text-white dark:bg-white dark:text-black"
                    onClick={() => setStep('template-customize')}
                    disabled={!projectData.name || !projectData.template}
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 'upload' && (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center gap-4">
                  <Button variant="ghost" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <h1 className="text-4xl font-light text-black dark:text-white">
                    Upload Designs
                  </h1>
                </div>

                <p className="text-gray-500 dark:text-gray-400">
                  Upload screenshots of your application's UI flows
                </p>

                {/* Upload Area */}
                <div 
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
                    isDragging ? "border-black dark:border-white" : "border-gray-200 dark:border-neutral-800",
                    "hover:border-gray-300 dark:hover:border-neutral-700"
                  )}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                  <label 
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-4"
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="text-black dark:text-white font-medium">
                        Drop your screens here
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        or click to upload
                      </p>
                    </div>
                  </label>
                </div>

                {/* Uploaded Screens */}
                {uploadedScreens.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-medium text-black dark:text-white">
                      Uploaded Screens
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {uploadedScreens.map((screen) => (
                        <div 
                          key={screen.id} 
                          className="relative group aspect-[3/2] bg-gray-100 dark:bg-neutral-900 rounded-lg overflow-hidden"
                        >
                          <img 
                            src={screen.url} 
                            alt={screen.name}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeScreen(screen.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <label 
                        htmlFor="file-upload"
                        className="aspect-[3/2] border-2 border-dashed border-gray-200 dark:border-neutral-800 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-300 dark:hover:border-neutral-700 transition-colors"
                      >
                        <Plus className="h-6 w-6 text-gray-400" />
                      </label>
                    </div>
                  </div>
                )}

                {uploadedScreens.length > 0 && (
                  <div className="flex justify-end">
                    <Button 
                      className="bg-black text-white dark:bg-white dark:text-black"
                      onClick={() => setStep('organization')}
                    >
                      Continue
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {step === 'organization' && (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center gap-4">
                  <Button variant="ghost" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <h1 className="text-4xl font-light text-black dark:text-white">
                    Organize Screens
                  </h1>
                </div>

                <p className="text-gray-500 dark:text-gray-400">
                  Arrange your screens into user flows
                </p>

                <div className="grid grid-cols-1">
                  {/* Flow Builder */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-medium text-black dark:text-white">
                        Flow Builder
                      </h2>
                      <Button variant="outline" onClick={addNewFlow}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Flow
                      </Button>
                    </div>

                    <div className="space-y-6">
                      {flows.map((flow) => (
                        <FlowBuilder
                          key={flow.id}
                          flow={flow}
                          screens={uploadedScreens}
                          onUpdate={updateFlow}
                          onDelete={deleteFlow}
                          availableScreens={uploadedScreens.filter(screen => 
                            !flow.screens.some(s => s.screenId === screen.id)
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => setStep('upload')}
                  >
                    Add More Screens
                  </Button>
                  <Button 
                    className="bg-black text-white dark:bg-white dark:text-black"
                    onClick={() => setStep('detection')}
                    disabled={!hasScreensInFlows()}
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 'detection' && (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center gap-4">
                  <Button variant="ghost" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <h1 className="text-4xl font-light text-black dark:text-white">
                    Component Detection
                  </h1>
                </div>

                <p className="text-gray-500 dark:text-gray-400">
                  AI is analyzing your screens to identify components
                </p>

                <div className="space-y-8">
                  {flows.map((flow) => (
                    <div key={flow.id} className="space-y-4">
                      <h2 className="text-xl font-medium text-black dark:text-white">
                        {flow.name}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {flow.screens.map((screenNode) => {
                          const screen = uploadedScreens.find(s => s.id === screenNode.screenId);
                          if (!screen) return null;
                          
                          return (
                            <ComponentDetectionPreview
                              key={screenNode.id}
                              screen={screen}
                              detectedComponents={getDetectedComponents(screen.id)}
                              onComponentSelect={handleComponentSelect}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button 
                    className="bg-black text-white dark:bg-white dark:text-black"
                    onClick={() => setStep('review')}
                  >
                    Review Components
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const ProjectOptionCard: React.FC<{
  title: string;
  description: string;
  onClick: () => void;
}> = ({ title, description, onClick }) => (
  <Card 
    className="p-6 cursor-pointer hover:border-gray-400 dark:hover:border-neutral-600 transition-all"
    onClick={onClick}
  >
    <h3 className="text-xl font-medium text-black dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-gray-500 dark:text-gray-400">
      {description}
    </p>
  </Card>
);

const getProgressWidth = (step: CreationStep): string => {
  switch (step) {
    case 'selection': return "25%";
    case 'template': return "50%";
    case 'upload': return "50%";
    case 'organization': return "75%";
    default: return "0%";
  }
};

interface TemplateCard extends DesignTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  components: number;
  styles: Record<string, any>;
}

const templates: TemplateCard[] = [
  {
    id: 'minimal',
    name: 'Minimal UI',
    description: 'Clean, modern interface with essential components',
    preview: '/templates/minimal.png',
    components: 24,
    styles: {}
  },
  // ... more templates
];

const TemplateCard: React.FC<{
  template: TemplateCard;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ template, isSelected, onSelect }) => (
  <Card 
    className={cn(
      "p-4 cursor-pointer transition-all",
      isSelected 
        ? "border-black dark:border-white" 
        : "hover:border-gray-400 dark:hover:border-neutral-600"
    )}
    onClick={onSelect}
  >
    <div className="aspect-video bg-gray-100 dark:bg-neutral-900 rounded-md mb-4">
      <img 
        src={template.preview} 
        alt={template.name}
        className="w-full h-full object-cover rounded-md"
      />
    </div>
    <h3 className="font-medium text-black dark:text-white">
      {template.name}
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
      {template.description}
    </p>
    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
      {template.components} components
    </div>
  </Card>
); 