
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '../context/AppContext';
import { Ship, Wrench, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { state } = useApp();

  // Calculate KPIs
  const totalShips = state.ships.length;
  const activeShips = state.ships.filter(ship => ship.status === 'Active').length;
  const shipsUnderMaintenance = state.ships.filter(ship => ship.status === 'Under Maintenance').length;
  
  const totalJobs = state.jobs.length;
  const openJobs = state.jobs.filter(job => job.status === 'Open').length;
  const inProgressJobs = state.jobs.filter(job => job.status === 'In Progress').length;
  const completedJobs = state.jobs.filter(job => job.status === 'Completed').length;
  
  // Check for overdue maintenance
  const currentDate = new Date();
  const overdueComponents = state.components.filter(component => {
    const lastMaintenanceDate = new Date(component.lastMaintenanceDate);
    const monthsDiff = (currentDate.getTime() - lastMaintenanceDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsDiff > 6; // Consider overdue if last maintenance was over 6 months ago
  });

  const recentJobs = state.jobs
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
    .slice(0, 5);

  const getStatusBadge = (status: string) => {
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

  const getPriorityBadge = (priority: string) => {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Welcome to your ship maintenance tracker</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-slate-200 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Ships</p>
                <p className="text-3xl font-bold text-slate-900">{totalShips}</p>
                <p className="text-xs text-green-600 mt-1">
                  {activeShips} Active • {shipsUnderMaintenance} Under Maintenance
                </p>
              </div>
              <div className="w-12 h-12 bg-maritime-100 rounded-lg flex items-center justify-center">
                <Ship className="w-6 h-6 text-maritime-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Overdue Maintenance</p>
                <p className="text-3xl font-bold text-red-600">{overdueComponents.length}</p>
                <p className="text-xs text-slate-500 mt-1">Components requiring attention</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Jobs in Progress</p>
                <p className="text-3xl font-bold text-yellow-600">{inProgressJobs}</p>
                <p className="text-xs text-slate-500 mt-1">{openJobs} Open • {completedJobs} Completed</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Completed Jobs</p>
                <p className="text-3xl font-bold text-green-600">{completedJobs}</p>
                <p className="text-xs text-green-600 mt-1">
                  {completedJobs > 0 ? '+' : ''}{Math.round((completedJobs / totalJobs) * 100)}% completion rate
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="w-5 h-5 mr-2" />
              Recent Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.length > 0 ? (
                recentJobs.map((job) => {
                  const ship = state.ships.find(s => s.id === job.shipId);
                  const component = state.components.find(c => c.id === job.componentId);
                  
                  return (
                    <div key={job.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-slate-900">{job.type}</h4>
                        <p className="text-sm text-slate-600">
                          {ship?.name} • {component?.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Scheduled: {new Date(job.scheduledDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        {getStatusBadge(job.status)}
                        {getPriorityBadge(job.priority)}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-500 text-center py-4">No jobs found</p>
              )}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link 
                to="/jobs" 
                className="text-maritime-600 hover:text-maritime-700 text-sm font-medium"
              >
                View all jobs →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Ship Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Fleet Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {state.ships.map((ship) => {
                const shipComponents = state.components.filter(c => c.shipId === ship.id);
                const shipJobs = state.jobs.filter(j => j.shipId === ship.id && j.status !== 'Completed');
                
                return (
                  <div key={ship.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-900">{ship.name}</h4>
                      <p className="text-sm text-slate-600">IMO: {ship.imo} • {ship.flag}</p>
                      <p className="text-xs text-slate-500">
                        {shipComponents.length} components • {shipJobs.length} active jobs
                      </p>
                    </div>
                    <div>
                      <Badge 
                        className={
                          ship.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : ship.status === 'Under Maintenance'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {ship.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link 
                to="/ships" 
                className="text-maritime-600 hover:text-maritime-700 text-sm font-medium"
              >
                Manage ships →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/ships/new" 
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Ship className="w-8 h-8 text-maritime-600 mb-2" />
              <h3 className="font-medium text-slate-900">Add New Ship</h3>
              <p className="text-sm text-slate-600">Register a new ship</p>
            </Link>
            
            <Link 
              to="/jobs/new" 
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Wrench className="w-8 h-8 text-maritime-600 mb-2" />
              <h3 className="font-medium text-slate-900">Create Job</h3>
              <p className="text-sm text-slate-600">Schedule maintenance</p>
            </Link>
            
            <Link 
              to="/calendar" 
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Clock className="w-8 h-8 text-maritime-600 mb-2" />
              <h3 className="font-medium text-slate-900">View Calendar</h3>
              <p className="text-sm text-slate-600">Check schedule</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
