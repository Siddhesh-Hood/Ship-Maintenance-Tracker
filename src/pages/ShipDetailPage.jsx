
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '../context/AppContext';
import { 
  Ship, 
  ArrowLeft, 
  Edit, 
  Plus, 
  Settings, 
  Wrench, 
  Calendar,
  AlertTriangle,
  Trash2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ComponentForm from '../components/ComponentForm';
import JobForm from '../components/JobForm';

const ShipDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [showComponentForm, setShowComponentForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);

  const ship = state.ships.find(s => s.id === id);
  const shipComponents = state.components.filter(c => c.shipId === id);
  const shipJobs = state.jobs.filter(j => j.shipId === id);

  if (!ship) {
    return (
      <div className="text-center py-12">
        <Ship className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900">Ship not found</h2>
        <p className="text-slate-600 mt-2">The requested ship could not be found.</p>
        <Link to="/ships">
          <Button className="mt-4">Back to Ships</Button>
        </Link>
      </div>
    );
  }

  const handleDeleteComponent = (componentId) => {
    const hasJobs = state.jobs.some(j => j.componentId === componentId);
    if (hasJobs) {
      toast({
        title: 'Cannot delete component',
        description: 'This component has associated jobs. Please remove them first.',
        variant: 'destructive',
      });
      return;
    }

    dispatch({ type: 'DELETE_COMPONENT', payload: componentId });
    toast({
      title: 'Component deleted',
      description: 'The component has been successfully removed.',
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'Under Maintenance':
        return <Badge className="bg-orange-100 text-orange-800">Under Maintenance</Badge>;
      case 'Inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getJobStatusBadge = (status) => {
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

  // Check for components needing maintenance
  const currentDate = new Date();
  const componentsNeedingMaintenance = shipComponents.filter(component => {
    const lastMaintenanceDate = new Date(component.lastMaintenanceDate);
    const monthsDiff = (currentDate.getTime() - lastMaintenanceDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsDiff > 6;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/ships')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Ships
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center">
              <Ship className="w-8 h-8 mr-3 text-maritime-600" />
              {ship.name}
            </h1>
            <p className="text-slate-600 mt-1">IMO: {ship.imo} • Flag: {ship.flag}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(ship.status)}
          <Link to={`/ships/${ship.id}/edit`}>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Ship
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Components</p>
                <p className="text-2xl font-bold">{shipComponents.length}</p>
              </div>
              <Settings className="w-8 h-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Jobs</p>
                <p className="text-2xl font-bold text-orange-600">
                  {shipJobs.filter(j => j.status !== 'Completed').length}
                </p>
              </div>
              <Wrench className="w-8 h-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Completed Jobs</p>
                <p className="text-2xl font-bold text-green-600">
                  {shipJobs.filter(j => j.status === 'Completed').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Overdue Maintenance</p>
                <p className="text-2xl font-bold text-red-600">{componentsNeedingMaintenance.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {componentsNeedingMaintenance.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <div>
                <h3 className="font-medium text-red-900">Maintenance Alert</h3>
                <p className="text-sm text-red-700">
                  {componentsNeedingMaintenance.length} component(s) require maintenance attention
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="components">Components ({shipComponents.length})</TabsTrigger>
          <TabsTrigger value="jobs">Maintenance Jobs ({shipJobs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ship Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Name:</span>
                    <span className="font-medium">{ship.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">IMO Number:</span>
                    <span className="font-medium">{ship.imo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Flag:</span>
                    <span className="font-medium">{ship.flag}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status:</span>
                    {getStatusBadge(ship.status)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {shipJobs.slice(0, 5).map((job) => {
                    const component = state.components.find(c => c.id === job.componentId);
                    return (
                      <div key={job.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                        <div>
                          <p className="font-medium text-sm">{job.type}</p>
                          <p className="text-xs text-slate-600">{component?.name}</p>
                        </div>
                        {getJobStatusBadge(job.status)}
                      </div>
                    );
                  })}
                  {shipJobs.length === 0 && (
                    <p className="text-slate-500 text-center py-4">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="components">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Ship Components</CardTitle>
                <Button onClick={() => setShowComponentForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Component
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shipComponents.map((component) => {
                  const lastMaintenanceDate = new Date(component.lastMaintenanceDate);
                  const monthsSinceMaintenance = (currentDate.getTime() - lastMaintenanceDate.getTime()) / 
                    (1000 * 60 * 60 * 24 * 30);
                  const needsMaintenance = monthsSinceMaintenance > 6;

                  return (
                    <div key={component.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{component.name}</h4>
                        <p className="text-sm text-slate-600">Serial: {component.serialNumber}</p>
                        <p className="text-xs text-slate-500">
                          Installed: {new Date(component.installDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-500">
                          Last Maintenance: {lastMaintenanceDate.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {needsMaintenance && (
                          <Badge variant="destructive" className="text-xs">
                            Overdue
                          </Badge>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingComponent(component);
                            setShowComponentForm(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteComponent(component.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {shipComponents.length === 0 && (
                  <div className="text-center py-8">
                    <Settings className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No components</h3>
                    <p className="text-slate-600">Add components to track their maintenance.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Maintenance Jobs</CardTitle>
                <Button onClick={() => setShowJobForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Job
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shipJobs.map((job) => {
                  const component = state.components.find(c => c.id === job.componentId);
                  return (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{job.type}</h4>
                        <p className="text-sm text-slate-600">{component?.name}</p>
                        <p className="text-xs text-slate-500">
                          Scheduled: {new Date(job.scheduledDate).toLocaleDateString()}
                        </p>
                        {job.description && (
                          <p className="text-xs text-slate-500 mt-1">{job.description}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {getPriorityBadge(job.priority)}
                        {getJobStatusBadge(job.status)}
                      </div>
                    </div>
                  );
                })}
                {shipJobs.length === 0 && (
                  <div className="text-center py-8">
                    <Wrench className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No maintenance jobs</h3>
                    <p className="text-slate-600">Create jobs to schedule maintenance work.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Component Form Modal */}
      {showComponentForm && (
        <ComponentForm
          shipId={ship.id}
          component={editingComponent}
          onClose={() => {
            setShowComponentForm(false);
            setEditingComponent(null);
          }}
        />
      )}

      {/* Job Form Modal */}
      {showJobForm && (
        <JobForm
          shipId={ship.id}
          onClose={() => setShowJobForm(false)}
        />
      )}
    </div>
  );
};

export default ShipDetailPage;
