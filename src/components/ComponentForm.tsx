
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useApp } from '../context/AppContext';
import { generateId } from '../utils/localStorage';
import { toast } from '@/hooks/use-toast';

interface ComponentFormProps {
  shipId: string;
  component?: any;
  onClose: () => void;
}

const ComponentForm: React.FC<ComponentFormProps> = ({ shipId, component, onClose }) => {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    installDate: '',
    lastMaintenanceDate: '',
  });

  useEffect(() => {
    if (component) {
      setFormData({
        name: component.name,
        serialNumber: component.serialNumber,
        installDate: component.installDate,
        lastMaintenanceDate: component.lastMaintenanceDate,
      });
    }
  }, [component]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (component) {
      // Update existing component
      dispatch({
        type: 'UPDATE_COMPONENT',
        payload: {
          ...component,
          ...formData,
        },
      });
      toast({
        title: 'Component updated',
        description: 'The component has been successfully updated.',
      });
    } else {
      // Create new component
      dispatch({
        type: 'ADD_COMPONENT',
        payload: {
          id: generateId(),
          shipId,
          ...formData,
        },
      });
      toast({
        title: 'Component added',
        description: 'The component has been successfully added.',
      });
    }
    
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {component ? 'Edit Component' : 'Add Component'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Component Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Main Engine"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="serialNumber">Serial Number</Label>
            <Input
              id="serialNumber"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              placeholder="e.g., ME-1234"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="installDate">Installation Date</Label>
            <Input
              id="installDate"
              type="date"
              value={formData.installDate}
              onChange={(e) => setFormData({ ...formData, installDate: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="lastMaintenanceDate">Last Maintenance Date</Label>
            <Input
              id="lastMaintenanceDate"
              type="date"
              value={formData.lastMaintenanceDate}
              onChange={(e) => setFormData({ ...formData, lastMaintenanceDate: e.target.value })}
              required
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {component ? 'Update Component' : 'Add Component'}
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

export default ComponentForm;
