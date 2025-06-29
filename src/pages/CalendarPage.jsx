import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '../context/AppContext';
import { Calendar, ChevronLeft, ChevronRight, Clock, Bell } from 'lucide-react';

const CalendarPage = () => {
  const { state } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('monthly'); // 'monthly' or 'weekly'

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getJobsForDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return state.jobs.filter(job => {
      if (!job.scheduledDate) return false;
      // Ensure we're comparing dates in the same format
      const jobDate = new Date(job.scheduledDate);
      const jobYear = jobDate.getFullYear();
      const jobMonth = String(jobDate.getMonth() + 1).padStart(2, '0');
      const jobDay = String(jobDate.getDate()).padStart(2, '0');
      const jobDateStr = `${jobYear}-${jobMonth}-${jobDay}`;
      
      return jobDateStr === dateStr;
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const navigateWeek = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setDate(prev.getDate() - 7);
      } else {
        newDate.setDate(prev.getDate() + 7);
      }
      return newDate;
    });
  };

  const getWeekDates = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(date.getDate() - day);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      weekDates.push(weekDate);
    }
    return weekDates;
  };

  const renderMonthlyCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-slate-100"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      // Fix: Create date object properly to avoid timezone issues
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const jobs = getJobsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

      days.push(
        <div
          key={day}
          className={`h-24 border border-slate-100 p-1 cursor-pointer hover:bg-slate-50 transition-colors ${
            isToday ? 'bg-maritime-50 border-maritime-200' : ''
          } ${isSelected ? 'bg-maritime-100 border-maritime-300' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-maritime-700' : 'text-slate-700'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {jobs.slice(0, 2).map((job) => {
              const ship = state.ships.find(s => s.id === job.shipId);
              return (
                <div
                  key={job.id}
                  className={`text-xs p-1 rounded truncate ${
                    job.priority === 'High' 
                      ? 'bg-red-100 text-red-800' 
                      : job.priority === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                  title={`${job.type} - ${ship?.name}`}
                >
                  {job.type}
                </div>
              );
            })}
            {jobs.length > 2 && (
              <div className="text-xs text-slate-500">+{jobs.length - 2} more</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const renderWeeklyCalendar = () => {
    const weekDates = getWeekDates(currentDate);
    
    return weekDates.map((date, index) => {
      const jobs = getJobsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

      return (
        <div
          key={index}
          className={`h-32 border border-slate-100 p-2 cursor-pointer hover:bg-slate-50 transition-colors ${
            isToday ? 'bg-maritime-50 border-maritime-200' : ''
          } ${isSelected ? 'bg-maritime-100 border-maritime-300' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className={`text-sm font-medium mb-2 ${isToday ? 'text-maritime-700' : 'text-slate-700'}`}>
            {date.getDate()}
          </div>
          <div className="space-y-1">
            {jobs.slice(0, 3).map((job) => {
              const ship = state.ships.find(s => s.id === job.shipId);
              return (
                <div
                  key={job.id}
                  className={`text-xs p-1 rounded truncate ${
                    job.priority === 'High' 
                      ? 'bg-red-100 text-red-800' 
                      : job.priority === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                  title={`${job.type} - ${ship?.name}`}
                >
                  {job.type}
                </div>
              );
            })}
            {jobs.length > 3 && (
              <div className="text-xs text-slate-500">+{jobs.length - 3} more</div>
            )}
          </div>
        </div>
      );
    });
  };

  const selectedDateJobs = selectedDate ? getJobsForDate(selectedDate) : [];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return <Badge variant="destructive">Open</Badge>;
      case 'In Progress':
        return <Badge className="bg-yellow-500">In Progress</Badge>;
      case 'Completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <Badge variant="destructive">High</Badge>;
      case 'Medium':
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case 'Low':
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center">
          <Calendar className="w-8 h-8 mr-3 text-maritime-600" />
          Maintenance Calendar
        </h1>
        <p className="text-slate-600 mt-1">Schedule and track maintenance jobs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  {viewMode === 'monthly' 
                    ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                    : `Week of ${currentDate.toLocaleDateString()}`
                  }
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="flex border rounded-md">
                    <Button 
                      variant={viewMode === 'monthly' ? 'default' : 'ghost'} 
                      size="sm"
                      onClick={() => setViewMode('monthly')}
                      className="rounded-r-none"
                    >
                      Month
                    </Button>
                    <Button 
                      variant={viewMode === 'weekly' ? 'default' : 'ghost'} 
                      size="sm"
                      onClick={() => setViewMode('weekly')}
                      className="rounded-l-none"
                    >
                      Week
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => viewMode === 'monthly' ? navigateMonth('prev') : navigateWeek('prev')}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                    Today
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => viewMode === 'monthly' ? navigateMonth('next') : navigateWeek('next')}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-0 mb-4 ${viewMode === 'monthly' ? 'grid-cols-7' : 'grid-cols-7'}`}>
                {dayNames.map((day) => (
                  <div key={day} className="h-8 flex items-center justify-center font-medium text-slate-600 text-sm">
                    {day}
                  </div>
                ))}
              </div>
              <div className={`grid gap-0 border border-slate-200 rounded-lg overflow-hidden ${
                viewMode === 'monthly' ? 'grid-cols-7' : 'grid-cols-7'
              }`}>
                {viewMode === 'monthly' ? renderMonthlyCalendar() : renderWeeklyCalendar()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Clock className="w-5 h-5 mr-2" />
                {selectedDate ? selectedDate.toLocaleDateString() : 'Select a Date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                <div className="space-y-4">
                  {selectedDateJobs.length > 0 ? (
                    <>
                      <p className="text-sm text-slate-600 mb-3">
                        {selectedDateJobs.length} job(s) scheduled
                      </p>
                      {selectedDateJobs.map((job) => {
                        const ship = state.ships.find(s => s.id === job.shipId);
                        const component = state.components.find(c => c.id === job.componentId);
                        
                        return (
                          <div key={job.id} className="p-3 border rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">{job.type}</h4>
                              <div className="flex space-x-1">
                                {getPriorityBadge(job.priority)}
                                {getStatusBadge(job.status)}
                              </div>
                            </div>
                            <div className="text-xs text-slate-600">
                              <p><strong>Ship:</strong> {ship?.name}</p>
                              <p><strong>Component:</strong> {component?.name}</p>
                            </div>
                            {job.description && (
                              <p className="text-xs text-slate-500 italic">{job.description}</p>
                            )}
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">No jobs scheduled</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Click on a date to view scheduled jobs</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Priority Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                  <span className="text-sm">High Priority</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
                  <span className="text-sm">Medium Priority</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                  <span className="text-sm">Low Priority</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
