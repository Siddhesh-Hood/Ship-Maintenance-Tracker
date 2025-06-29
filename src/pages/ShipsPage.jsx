
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useApp } from '../context/AppContext';
import { Ship, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

const ShipsPage = () => {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredShips = state.ships.filter(ship => {
    const matchesSearch = ship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ship.imo.includes(searchTerm) ||
                         ship.flag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ship.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteShip = (shipId) => {
    const hasComponents = state.components.some(c => c.shipId === shipId);
    const hasJobs = state.jobs.some(j => j.shipId === shipId);
    
    if (hasComponents || hasJobs) {
      toast({
        title: 'Cannot delete ship',
        description: 'This ship has associated components or jobs. Please remove them first.',
        variant: 'destructive',
      });
      return;
    }

    dispatch({ type: 'DELETE_SHIP', payload: shipId });
    toast({
      title: 'Ship deleted',
      description: 'The ship has been successfully removed.',
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ships Management</h1>
          <p className="text-slate-600 mt-1">Manage your fleet of ships</p>
        </div>
        <Link to="/ships/new">
          <Button className="bg-maritime-600 hover:bg-maritime-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Ship
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search ships by name, IMO, or flag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                All ({state.ships.length})
              </Button>
              <Button
                variant={statusFilter === 'Active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('Active')}
              >
                Active ({state.ships.filter(s => s.status === 'Active').length})
              </Button>
              <Button
                variant={statusFilter === 'Under Maintenance' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('Under Maintenance')}
              >
                Maintenance ({state.ships.filter(s => s.status === 'Under Maintenance').length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShips.map((ship) => {
          const shipComponents = state.components.filter(c => c.shipId === ship.id);
          const shipJobs = state.jobs.filter(j => j.shipId === ship.id && j.status !== 'Completed');
          
          return (
            <Card key={ship.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-maritime-100 rounded-lg flex items-center justify-center">
                      <Ship className="w-5 h-5 text-maritime-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{ship.name}</CardTitle>
                      <p className="text-sm text-slate-600">IMO: {ship.imo}</p>
                    </div>
                  </div>
                  {getStatusBadge(ship.status)}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Flag:</span>
                    <span className="font-medium">{ship.flag}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Components:</span>
                    <span className="font-medium">{shipComponents.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Active Jobs:</span>
                    <span className="font-medium text-orange-600">{shipJobs.length}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Link to={`/ships/${ship.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Link to={`/ships/${ship.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Ship</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {ship.name}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteShip(ship.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredShips.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Ship className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No ships found</h3>
            <p className="text-slate-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search criteria or filters.'
                : 'Get started by adding your first ship to the fleet.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link to="/ships/new">
                <Button className="bg-maritime-600 hover:bg-maritime-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Ship
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShipsPage;
