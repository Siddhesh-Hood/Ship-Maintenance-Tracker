
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useApp } from '../context/AppContext';
import { generateId } from '../utils/localStorage';
import { toast } from '@/hooks/use-toast';

interface JobFormProps {
  shipId: string;
  onClose: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ shipId, onClose }) => {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    componentId: '',
    type: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    status: 'Open' as 'Open' | 'In Progress' | 'Completed',
    assignedEngineerId: '',
    scheduledDate: '',
    description: '',
  });

  const shipComponents = state.components.filter(c => c.shipId === shipId);
  const engineers = state.users.filter(u => u.role === 'Engineer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newJob = {
      id: generateId(),
      shipId,
      createdDate: new Date().toISOString().split('T')[0],
      ...formData,
    };

    dispatch({ type: 'ADD_JOB', payload: newJob });
    
    // Create notification
    const notification = {
      id: generateId(),
      message: `New ${formData.type} job created for ${state.ships.find(s => s.id === shipId)?.name}`,
      type: 'job-created' as const,
      timestamp: new Date().toISOString(),
      read: false,
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    
    toast({
      title: 'Job created',
      description: 'The maintenance job has been successfully created.',
    });
    
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Maintenance Job</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="componentId">Component</Label>
            <Select value={formData.componentId} onValueChange={(value) => setFormData({ ...formData, componentId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select component" />
              </SelectTrigger>
              <SelectContent>
                {shipComponents.map((component) => (
                  <SelectItem key={component.id} value={component.id}>
                    {component.name} ({component.serialNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="type">Job Type</Label>
            <Input
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              placeholder="e.g., Inspection, Repair, Replacement"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={formData.priority} onValueChange={(value: 'High' | 'Medium' | 'Low') => setFormData({ ...formData, priority: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="assignedEngineerId">Assigned Engineer</Label>
            <Select value={formData.assignedEngineerId} onValueChange={(value) => setFormData({ ...formData, assignedEngineerId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select engineer" />
              </SelectTrigger>
              <SelectContent>
                {engineers.map((engineer) => (
                  <SelectItem key={engineer.id} value={engineer.id}>
                    {engineer.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="scheduledDate">Scheduled Date</Label>
            <Input
              id="scheduledDate"
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Job description..."
              rows={3}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              Create Job
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobForm;
