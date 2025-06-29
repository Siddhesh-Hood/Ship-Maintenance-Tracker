
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { 
  Ship, 
  Settings, 
  Wrench, 
  AlertTriangle, 
  Calendar,
  TrendingUp,
  Activity
} from 'lucide-react';

const DashboardPage = () => {
  const { state } = useApp();

  // Calculate KPIs
  const totalShips = state.ships.length;
  const activeShips = state.ships.filter(s => s.status === 'Active').length;
  const shipsUnderMaintenance = state.ships.filter(s => s.status === 'Under Maintenance').length;
  
  const totalComponents = state.components.length;
  const currentDate = new Date();
  const componentsOverdue = state.components.filter(component => {
    const lastMaintenanceDate = new Date(component.lastMaintenanceDate);
    const monthsDiff = (currentDate.getTime() - lastMaintenanceDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsDiff > 6;
  }).length;

  const totalJobs = state.jobs.length;
  const jobsInProgress = state.jobs.filter(j => j.status === 'In Progress').length;
  const jobsCompleted = state.jobs.filter(j => j.status === 'Completed').length;
  const openJobs = state.jobs.filter(j => j.status === 'Open').length;

  const recentJobs = state.jobs.slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Welcome back, {state.currentUser?.role}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Ships</p>
                <p className="text-3xl font-bold text-slate-900">{totalShips}</p>
                <p className="text-xs text-green-600 mt-1">
                  {activeShips} Active • {shipsUnderMaintenance} Maintenance
                </p>
              </div>
              <div className="w-12 h-12 bg-maritime-100 rounded-lg flex items-center justify-center">
                <Ship className="w-6 h-6 text-maritime-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Components</p>
                <p className="text-3xl font-bold text-slate-900">{totalComponents}</p>
                <p className="text-xs text-red-600 mt-1">
                  {componentsOverdue} Overdue Maintenance
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Jobs in Progress</p>
                <p className="text-3xl font-bold text-yellow-600">{jobsInProgress}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {openJobs} Open • {jobsCompleted} Completed
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Wrench className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Completed Jobs</p>
                <p className="text-3xl font-bold text-green-600">{jobsCompleted}</p>
                <p className="text-xs text-green-600 mt-1">
                  {totalJobs > 0 ? Math.round((jobsCompleted / totalJobs) * 100) : 0}% Success Rate
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {componentsOverdue > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                <div>
                  <h3 className="font-medium text-red-900">Maintenance Alert</h3>
                  <p className="text-sm text-red-700">
                    {componentsOverdue} component(s) require immediate maintenance attention
                  </p>
                </div>
              </div>
              <Link to="/ships">
                <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100">
                  View Details
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Recent Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.length > 0 ? recentJobs.map((job) => {
                const ship = state.ships.find(s => s.id === job.shipId);
                const component = state.components.find(c => c.id === job.componentId);
                
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

                return (
                  <div key={job.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{job.type}</p>
                      <p className="text-xs text-slate-600">{ship?.name} • {component?.name}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(job.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(job.status)}
                  </div>
                );
              }) : (
                <p className="text-slate-500 text-center py-4">No recent jobs</p>
              )}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link to="/jobs">
                <Button variant="outline" className="w-full">
                  View All Jobs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link to="/ships/new" className="block">
                <Button className="w-full bg-maritime-600 hover:bg-maritime-700">
                  <Ship className="w-4 h-4 mr-2" />
                  Add New Ship
                </Button>
              </Link>
              
              <Link to="/jobs" className="block">
                <Button variant="outline" className="w-full">
                  <Wrench className="w-4 h-4 mr-2" />
                  Create Maintenance Job
                </Button>
              </Link>
              
              <Link to="/calendar" className="block">
                <Button variant="outline" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
