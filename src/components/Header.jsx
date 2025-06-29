
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '../context/AppContext';
import { Bell, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const unreadNotifications = state.notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
    dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    navigate('/login');
  };

  const handleNotifications = () => {
    navigate('/notifications');
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="p-2 hover:bg-slate-100 rounded-md" />
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Ship Maintenance Tracker
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNotifications}
          className="relative p-2 hover:bg-slate-100"
        >
          <Bell className="w-5 h-5 text-slate-600" />
          {unreadNotifications > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center p-0 min-w-[20px] h-5 bg-red-500 text-white border-0"
            >
              {unreadNotifications}
            </Badge>
          )}
        </Button>

        <div className="flex items-center space-x-2 px-3 py-1 bg-slate-100 rounded-md">
          <User className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">
            {state.currentUser?.role}
          </span>
        </div>

        <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-slate-100">
          <LogOut className="w-4 h-4 mr-2 text-slate-600" />
          <span className="text-slate-700">Logout</span>
        </Button>
      </div>
    </header>
  );
};
