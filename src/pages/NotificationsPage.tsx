
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '../context/AppContext';
import { Bell, Check, Trash2, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const NotificationsPage: React.FC = () => {
  const { state, dispatch } = useApp();

  const handleMarkAsRead = (notificationId: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
    toast({
      title: 'Notification marked as read',
    });
  };

  const handleMarkAllAsRead = () => {
    state.notifications.forEach(notification => {
      if (!notification.read) {
        dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notification.id });
      }
    });
    toast({
      title: 'All notifications marked as read',
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job-created':
        return <Bell className="w-5 h-5 text-blue-600" />;
      case 'job-updated':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'job-completed':
        return <Check className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'job-created':
        return 'border-l-blue-500 bg-blue-50';
      case 'job-updated':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'job-completed':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-slate-500 bg-slate-50';
    }
  };

  const unreadCount = state.notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center">
            <Bell className="w-8 h-8 mr-3 text-maritime-600" />
            Notifications
          </h1>
          <p className="text-slate-600 mt-1">
            Stay updated with maintenance activities and system alerts
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline">
            <Check className="w-4 h-4 mr-2" />
            Mark All as Read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Notifications</p>
                <p className="text-2xl font-bold">{state.notifications.length}</p>
              </div>
              <Bell className="w-8 h-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Unread</p>
                <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Read</p>
                <p className="text-2xl font-bold text-green-600">
                  {state.notifications.length - unreadCount}
                </p>
              </div>
              <Check className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {state.notifications.length > 0 ? (
              state.notifications
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start space-x-4 p-4 border-l-4 rounded-lg transition-colors ${
                      getNotificationColor(notification.type)
                    } ${notification.read ? 'opacity-60' : ''}`}
                  >
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <Badge variant="destructive" className="text-xs">
                              New
                            </Badge>
                          )}
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-xs"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No notifications</h3>
                <p className="text-slate-600">
                  You'll see maintenance job updates and system alerts here.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;
