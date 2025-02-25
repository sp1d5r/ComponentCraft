import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/shadcn/button';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-black dark:bg-white rounded-lg" />
          <span className="text-xl font-medium text-black dark:text-white">ComponentCraft</span>
        </div>
      </nav>

      {/* 404 Content */}
      <div className="text-center px-4">
        <h1 className="text-[12rem] leading-none font-medium tracking-tight text-black dark:text-white">
          404
        </h1>
        <p className="mt-8 text-lg text-gray-600 dark:text-gray-300">
          Oooops. Nothing to see here.
        </p>
        <Button
          className="mt-8 bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
          onClick={() => navigate('/')}
        >
          Take me home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
