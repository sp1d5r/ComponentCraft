import React from 'react';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';

export interface LandingLayoutProps {
  children: React.ReactNode;
}

const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative bg-white dark:bg-black z-10 rounded-b-[3rem] mb-[500px]">
        <Navbar />
        <main className="pb-24">
          {children}
        </main>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-0">
        <Footer />
      </div>
    </div>
  );
}

export default LandingLayout; 