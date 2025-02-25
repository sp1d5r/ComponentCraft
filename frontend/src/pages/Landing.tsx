import React from "react";
import { Button } from "../components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/shadcn/card";
import { Badge } from "../components/shadcn/badge";
import LandingLayout from "../layouts/LandingLayout";

export const Landing: React.FC = () => {
  return (
    <LandingLayout>
      <div className="flex flex-col gap-8">   
        {/* Hero Section */}
        <div className="relative flex flex-col justify-center items-center min-h-[90vh] border-b border-gray-200 dark:border-gray-800">
          <div className="relative z-10 text-center px-4 py-24 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-light text-center text-black dark:text-white font-serif tracking-tight mb-8">
              Crafting <span className="font-normal italic">extraordinary</span> components
            </h2>
            <p className="text-lg md:text-xl mb-12 text-gray-700 dark:text-gray-300 font-light max-w-2xl mx-auto">
              Elevate your design system with meticulously crafted components that blend form and function in perfect harmony.
            </p>
            <Button className="rounded-none border border-black dark:border-white bg-black text-white dark:bg-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all duration-300 px-8 py-6 text-lg">
              Explore Collection
            </Button>
            
            <div className="mt-16 flex items-center justify-center">
              <div className="flex -space-x-2">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="User" className="w-10 h-10 rounded-full border-2 border-white dark:border-black object-cover grayscale" />
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="User" className="w-10 h-10 rounded-full border-2 border-white dark:border-black object-cover grayscale" />
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1522&q=80" alt="User" className="w-10 h-10 rounded-full border-2 border-white dark:border-black object-cover grayscale" />
                <div className="w-10 h-10 rounded-full bg-gray-900 dark:bg-gray-100 border-2 border-white dark:border-black flex items-center justify-center text-sm font-light text-white dark:text-black">
                  5k+
                </div>
              </div>
              <div className="ml-4 flex flex-col justify-center items-start">
                <span className="text-gray-900 dark:text-gray-100">★★★★★</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm">from 5,000+ designers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20">
          <h1 className="text-2xl md:text-3xl font-light mb-16 text-center dark:text-white max-w-3xl mx-auto">
            A comprehensive design system for creating sophisticated, cohesive interfaces
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-16 max-w-6xl mx-auto px-4">
            <Card className="col-span-1 md:col-span-3 rounded-none border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-gray-100 transition-all duration-300">
              <CardHeader>
                <CardTitle className="font-light text-xl">Typography System</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  A meticulously crafted type scale that maintains perfect rhythm and hierarchy across all screen sizes.
                  <br />
                  <Button variant="link" className="p-0 text-black dark:text-white">Explore typography →</Button>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-4 border border-gray-200 dark:border-gray-800 p-6">
                  <div className="space-y-6">
                    <div className="flex flex-col">
                      <span className="text-4xl font-light mb-2">Display</span>
                      <span className="text-sm text-gray-500">48/52 · Serif Light</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-normal mb-2">Heading</span>
                      <span className="text-sm text-gray-500">24/28 · Serif Regular</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-normal mb-2">Body</span>
                      <span className="text-sm text-gray-500">16/24 · Sans Regular</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2 rounded-none border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-gray-100 transition-all duration-300">
              <CardHeader>
                <CardTitle className="font-light text-xl">Color Palette</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  A sophisticated monochromatic palette with carefully calibrated tones for perfect contrast.
                  <br />
                  <Button variant="link" className="p-0 text-black dark:text-white">View palette →</Button>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-4 grid grid-cols-5 gap-2">
                  <div className="aspect-square bg-black"></div>
                  <div className="aspect-square bg-gray-800"></div>
                  <div className="aspect-square bg-gray-600"></div>
                  <div className="aspect-square bg-gray-400"></div>
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="aspect-square bg-white border border-gray-200"></div>
                  <div className="aspect-square bg-gray-50 border border-gray-200"></div>
                  <div className="aspect-square bg-gray-100 border border-gray-200"></div>
                  <div className="aspect-square bg-gray-300"></div>
                  <div className="aspect-square bg-gray-500"></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 max-w-6xl mx-auto px-4">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <Card className="rounded-none border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-gray-100 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="font-light text-xl">Spacing System</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    A consistent spatial rhythm that creates harmonious layouts across all components.
                    <br/>
                    <Button variant="link" className="p-0 text-black dark:text-white">Learn more →</Button>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2 items-end">
                    <div className="h-4 w-4 bg-gray-900 dark:bg-gray-100"></div>
                    <div className="h-8 w-8 bg-gray-900 dark:bg-gray-100"></div>
                    <div className="h-12 w-12 bg-gray-900 dark:bg-gray-100"></div>
                    <div className="h-16 w-16 bg-gray-900 dark:bg-gray-100"></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-none border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-gray-100 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="font-light text-xl">Grid System</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    A flexible 12-column grid that adapts seamlessly to any screen size or device.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-12 gap-1 h-12">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="bg-gray-200 dark:bg-gray-800 h-full"></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="col-span-1 md:col-span-3 rounded-none border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-gray-100 transition-all duration-300">
              <CardHeader>
                <CardTitle className="font-light text-xl">Component Library</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  A comprehensive collection of meticulously designed components that work together seamlessly.
                  <br/>
                  <Button variant="link" className="p-0 text-black dark:text-white">Browse components →</Button>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-4 border border-gray-200 dark:border-gray-800 p-6 space-y-6">
                  <div className="flex space-x-4">
                    <Button className="rounded-none bg-black text-white dark:bg-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white border border-black dark:border-white">
                      Primary
                    </Button>
                    <Button variant="outline" className="rounded-none border-gray-300 dark:border-gray-700">
                      Secondary
                    </Button>
                    <Button variant="ghost" className="rounded-none">
                      Tertiary
                    </Button>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Badge className="rounded-none bg-black text-white dark:bg-white dark:text-black">New</Badge>
                    <Badge variant="outline" className="rounded-none">Default</Badge>
                    <Badge variant="secondary" className="rounded-none">Secondary</Badge>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-800 h-8 relative">
                    <div className="absolute left-0 top-0 h-full w-3/4 bg-black dark:bg-white"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Showcase Section */}
        <div className="flex flex-col md:flex-row max-w-6xl mx-auto py-20 px-4 border-t border-gray-200 dark:border-gray-800">
          <div className="w-full md:w-1/2 mb-12 md:mb-0">
            <img 
              src="https://images.unsplash.com/photo-1555421689-3f034debb7a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
              alt="Design system documentation" 
              className="w-full aspect-square h-auto object-cover grayscale"
            />
          </div>
          <div className="w-full md:w-1/2 md:pl-16 flex flex-col justify-center dark:text-white">
            <p className="font-light text-gray-500 dark:text-gray-400 mb-2">COMPREHENSIVE DOCUMENTATION</p>
            <h2 className="text-3xl font-light mb-6">Meticulous attention to detail</h2>
            <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
              Every component is thoroughly documented with usage guidelines, accessibility considerations, and implementation examples. Our design system ensures consistency across your entire product ecosystem.
            </p>
            <Button className="rounded-none border border-black dark:border-white bg-transparent text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 w-fit">
              View Documentation
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row max-w-6xl mx-auto py-20 px-4 border-t border-gray-200 dark:border-gray-800">
          <div className="w-full md:w-1/2 md:pr-16 flex flex-col justify-center order-2 md:order-1 dark:text-white">
            <p className="font-light text-gray-500 dark:text-gray-400 mb-2">DESIGN TOKENS</p>
            <h2 className="text-3xl font-light mb-6">The foundation of consistency</h2>
            <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
              Our design tokens provide a single source of truth for colors, typography, spacing, and more. This systematic approach ensures your design remains consistent as it scales across platforms and devices.
            </p>
            <Button className="rounded-none border border-black dark:border-white bg-transparent text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 w-fit">
              Explore Design Tokens
            </Button>
          </div>
          <div className="w-full md:w-1/2 mb-12 md:mb-0 order-1 md:order-2">
            <img 
              src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
              alt="Design tokens visualization" 
              className="w-full aspect-square h-auto object-cover grayscale"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative border-t border-gray-200 dark:border-gray-800 py-24">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h1 className="text-4xl md:text-5xl font-light mb-8 dark:text-white">
              Elevate your design system
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-12 max-w-xl mx-auto">
              Join thousands of designers and developers who are creating exceptional user experiences with our component library.
            </p>
            <Button className="rounded-none border border-black dark:border-white bg-black text-white dark:bg-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all duration-300 px-8 py-6 text-lg">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
};