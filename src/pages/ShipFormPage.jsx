
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '../context/AppContext';
import { Ship, ArrowLeft } from 'lucide-react';
import { generateId } from '../utils/localStorage';
import { toast } from '@/hooks/use-toast';

const ShipFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state, dispatch } = useApp();
  const isEditing = id && id !== 'new';
  
  const [formData, setFormData] = useState({
    name: '',
    imo: '',
    flag: '',
    status: 'Active',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      const ship = state.ships.find(s => s.id === id);
      if (ship) {
        setFormData({
          name: ship.name,
          imo: ship.imo,
          flag: ship.flag,
          status: ship.status,
        });
      } else {
        navigate('/ships');
      }
    }
  }, [id, isEditing, state.ships, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Ship name is required';
    }

    if (!formData.imo.trim()) {
      newErrors.imo = 'IMO number is required';
    } else if (!/^\d{7}$/.test(formData.imo)) {
      newErrors.imo = 'IMO number must be 7 digits';
    } else {
      const existingShip = state.ships.find(s => s.imo === formData.imo && s.id !== id);
      if (existingShip) {
        newErrors.imo = 'A ship with this IMO number already exists';
      }
    }

    if (!formData.flag.trim()) {
      newErrors.flag = 'Flag state is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (isEditing) {
      dispatch({
        type: 'UPDATE_SHIP',
        payload: {
          id: id,
          ...formData,
        },
      });
      toast({
        title: 'Ship updated',
        description: 'The ship information has been successfully updated.',
      });
    } else {
      dispatch({
        type: 'ADD_SHIP',
        payload: {
          id: generateId(),
          ...formData,
        },
      });
      toast({
        title: 'Ship added',
        description: 'The new ship has been successfully added to your fleet.',
      });
    }
    
    navigate('/ships');
  };

  const commonFlags = [
    'Panama', 'Liberia', 'Marshall Islands', 'Singapore', 'Malta',
    'Bahamas', 'Cyprus', 'China', 'Greece', 'Japan', 'Norway',
    'United Kingdom', 'USA', 'Germany', 'Netherlands', 'Italy'
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/ships')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Ships
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center">
            <Ship className="w-8 h-8 mr-3 text-maritime-600" />
            {isEditing ? 'Edit Ship' : 'Add New Ship'}
          </h1>
          <p className="text-slate-600 mt-1">
            {isEditing ? 'Update ship information' : 'Register a new vessel in your fleet'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ship Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Ship Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter ship name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="imo">IMO Number *</Label>
              <Input
                id="imo"
                value={formData.imo}
                onChange={(e) => setFormData({ ...formData, imo: e.target.value })}
                placeholder="Enter 7-digit IMO number"
                maxLength={7}
                className={errors.imo ? 'border-red-500' : ''}
              />
              {errors.imo && <p className="text-sm text-red-600">{errors.imo}</p>}
              <p className="text-xs text-slate-500">
                International Ship number (7 digits)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="flag">Flag State *</Label>
              <Select value={formData.flag} onValueChange={(value) => setFormData({ ...formData, flag: value })}>
                <SelectTrigger className={errors.flag ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select flag state" />
                </SelectTrigger>
                <SelectContent>
                  {commonFlags.map((flag) => (
                    <SelectItem key={flag} value={flag}>
                      {flag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.flag && <p className="text-sm text-red-600">{errors.flag}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4 pt-6">
              <Button 
                type="submit" 
                className="flex-1 bg-maritime-600 hover:bg-maritime-700"
              >
                {isEditing ? 'Update Ship' : 'Add Ship'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/ships')}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipFormPage;
