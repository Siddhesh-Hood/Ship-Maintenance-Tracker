
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '../context/AppContext';
import { Wrench, Search, Plus, Edit, Filter } from 'lucide-react';
import JobForm from '../components/JobForm';
import { toast } from '@/hooks/use-toast';
import { generateId } from '../utils/localStorage';

const JobsPage = () => {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [shipFilter, setShipFilter] = useState('all');
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedShipId, setSelectedShipId] = useState('');

  const filteredJobs = state.jobs.filter(job => {
    const ship = state.ships.find(s => s.id === job.shipId);
    const component = state.components.find(c => c.id === job.componentId);
    
    const matchesSearch = job.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ship?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || job.priority === priorityFilter;
    const matchesShip = shipFilter === 'all' || job.shipId === shipFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesShip;
  });

  const handleStatusUpdate = (jobId, newStatus) => {
    const job = state.jobs.find(j => j.id === jobId);
    if (!job) return;

    const updatedJob = { ...job, status: newStatus };
    dispatch({ type: 'UPDATE_JOB', payload: updatedJob });

    // Create notification
    const ship = state.ships.find(s => s.id === job.shipId);
    const notification = {
      id: generateId(),
      message: `Job ${job.type} for ${ship?.name} updated to ${newStatus}`,
      type: newStatus === 'Completed' ? 'job-completed' : 'job-updated',
      timestamp: new Date().toISOString(),
      read: false,
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });

    toast({
      title: 'Job updated',
      description: `Job status changed to ${newStatus}`,
    });
  };

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

  const handleCreateJob = (shipId) => {
    if (shipId) {
      setSelectedShipId(shipId);
    }
    setShowJobForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Maintenance Jobs</h1>
          <p className="text-slate-600 mt-1">Manage maintenance work across your fleet</p>
        </div>
        <Button 
          onClick={() => handleCreateJob()} 
          className="bg-maritime-600 hover:bg-maritime-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Job
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search jobs by type, ship, or component..."
                  
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={shipFilter} onValueChange={setShipFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Ship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ships</SelectItem>
                {state.ships.map((ship) => (
                  <SelectItem key={ship.id} value={ship.id}>
                    {ship.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => {
          const ship = state.ships.find(s => s.id === job.shipId);
          const component = state.components.find(c => c.id === job.componentId);
          const engineer = state.users.find(u => u.id === job.assignedEngineerId);
          
          return (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Wrench className="w-5 h-5 text-maritime-600" />
                      <h3 className="text-lg font-semibold text-slate-900">{job.type}</h3>
                      {getPriorityBadge(job.priority)}
                      {getStatusBadge(job.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                      <div>
                        <p><strong>Ship:</strong> {ship?.name} ({ship?.imo})</p>
                        <p><strong>Component:</strong> {component?.name}</p>
                        <p><strong>Serial:</strong> {component?.serialNumber}</p>
                      </div>
                      <div>
                        <p><strong>Scheduled:</strong> {new Date(job.scheduledDate).toLocaleDateString()}</p>
                        <p><strong>Assigned to:</strong> {engineer?.email || 'Unassigned'}</p>
                        <p><strong>Created:</strong> {new Date(job.createdDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {job.description && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-md">
                        <p className="text-sm text-slate-700">{job.description}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    {state.currentUser?.role === 'Admin' || state.currentUser?.role === 'Engineer' ? (
                      <>
                        {job.status === 'Open' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(job.id, 'In Progress')}
                            className="bg-yellow-600 hover:bg-yellow-700"
                          >
                            Start Job
                          </Button>
                        )}
                        {job.status === 'In Progress' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(job.id, 'Completed')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Complete
                          </Button>
                        )}
                        {job.status === 'Completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(job.id, 'In Progress')}
                          >
                            Reopen
                          </Button>
                        )}
                      </>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        {state.currentUser?.role} View
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Wrench className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No jobs found</h3>
            <p className="text-slate-600 mb-4">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || shipFilter !== 'all'
                ? 'Try adjusting your search criteria or filters.'
                : 'Create your first maintenance job to get started.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && shipFilter === 'all' && (
              <Button onClick={() => handleCreateJob()} className="bg-maritime-600 hover:bg-maritime-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Job
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Job Form Modal */}
      {showJobForm && (
        <JobForm
          shipId={selectedShipId}
          onClose={() => {
            setShowJobForm(false);
            setSelectedShipId('');
          }}
        />
      )}
    </div>
  );
};

export default JobsPage;
