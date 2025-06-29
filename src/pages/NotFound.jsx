
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Ship, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mx-auto w-24 h-24 bg-maritime-100 rounded-full flex items-center justify-center mb-8">
          <Ship className="w-12 h-12 text-maritime-600" />
        </div>
        
        <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">Page Not Found</h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          The page you're looking for seems to have sailed away. 
          Let's get you back on course.
        </p>
        
        <div className="space-y-4">
          <Link to="/">
            <Button className="bg-maritime-600 hover:bg-maritime-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/ships" className="text-maritime-600 hover:text-maritime-700 hover:underline">
              Ships
            </Link>
            <Link to="/jobs" className="text-maritime-600 hover:text-maritime-700 hover:underline">
              Jobs
            </Link>
            <Link to="/calendar" className="text-maritime-600 hover:text-maritime-700 hover:underline">
              Calendar
            </Link>
            <Link to="/notifications" className="text-maritime-600 hover:text-maritime-700 hover:underline">
              Notifications
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
