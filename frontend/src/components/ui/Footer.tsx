import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "../shadcn/button";
import { Input } from "../shadcn/input";
import { Twitter, Github, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16">
          <div className="md:col-span-4">
            <Link to="/" className="text-xl font-light mb-4 inline-block">ComponentCraft</Link>
            <p className="text-sm text-gray-400 mt-4 max-w-xs">
              A comprehensive design system for creating sophisticated, cohesive interfaces with meticulously crafted components.
            </p>
            <div className="flex space-x-4 mt-6">
              <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-white">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-white">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-white">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="text-sm font-normal mb-4 text-gray-300">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-xs text-gray-400 hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-xs text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/documentation" className="text-xs text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link to="/releases" className="text-xs text-gray-400 hover:text-white transition-colors">Releases</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="text-sm font-normal mb-4 text-gray-300">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-xs text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><Link to="/blog" className="text-xs text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/careers" className="text-xs text-gray-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-xs text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="text-sm font-normal mb-4 text-gray-300">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-xs text-gray-400 hover:text-white transition-colors">Terms</Link></li>
              <li><Link to="/privacy" className="text-xs text-gray-400 hover:text-white transition-colors">Privacy</Link></li>
              <li><Link to="/cookies" className="text-xs text-gray-400 hover:text-white transition-colors">Cookies</Link></li>
              <li><Link to="/licenses" className="text-xs text-gray-400 hover:text-white transition-colors">Licenses</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="text-sm font-normal mb-4 text-gray-300">Newsletter</h4>
            <p className="text-xs text-gray-400 mb-4">Stay updated with our latest releases and news</p>
            <div className="flex">
              <Input 
                type="email" 
                placeholder="Email address" 
                className="rounded-l-full bg-gray-900 border-gray-800 text-xs h-9 focus-visible:ring-0 focus-visible:ring-offset-0" 
              />
              <Button className="rounded-r-full bg-white text-black hover:bg-gray-200 text-xs h-9">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 py-8 text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} ComponentCraft. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/terms" className="text-gray-500 hover:text-gray-400">Terms</Link>
            <Link to="/privacy" className="text-gray-500 hover:text-gray-400">Privacy</Link>
            <Link to="/cookies" className="text-gray-500 hover:text-gray-400">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}