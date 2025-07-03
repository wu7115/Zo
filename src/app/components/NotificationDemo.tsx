'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sun, SunMedium, Moon, Bell, Clock } from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';
import { getCurrentTimePeriod } from '@/hooks/use-notifications';

export function NotificationDemo() {
  const { notifications, unreadCount, markAllAsRead, clearAllNotifications } = useNotifications();
  const currentPeriod = getCurrentTimePeriod();

  const getTimePeriodIcon = (timePeriod: 'morning' | 'afternoon' | 'evening') => {
    switch (timePeriod) {
      case 'morning': return Sun;
      case 'afternoon': return SunMedium;
      case 'evening': return Moon;
    }
  };

  const getTimePeriodColor = (timePeriod: 'morning' | 'afternoon' | 'evening') => {
    switch (timePeriod) {
      case 'morning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'afternoon': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'evening': return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification System Demo
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {unreadCount} unread
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            {React.createElement(getTimePeriodIcon(currentPeriod), { className: "h-4 w-4" })}
            <span className="text-sm font-medium">Current Time Period:</span>
          </div>
          <Badge className={getTimePeriodColor(currentPeriod)}>
            {currentPeriod.charAt(0).toUpperCase() + currentPeriod.slice(1)}
          </Badge>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recent Notifications:</h4>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border text-sm ${
                    notification.read ? 'bg-background' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {React.createElement(getTimePeriodIcon(notification.timePeriod), { className: "h-3 w-3" })}
                      <span className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                        {notification.title}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getTimePeriodColor(notification.timePeriod)}`}
                    >
                      {notification.timePeriod.charAt(0).toUpperCase() + notification.timePeriod.slice(1)}
                    </Badge>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        notification.type === 'new-period' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {notification.type === 'new-period' ? 'New' : 'Reminder'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex-1"
          >
            <Clock className="h-3 w-3 mr-1" />
            Mark All Read
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
            className="flex-1"
          >
            Clear All
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          <p>Notifications are automatically generated:</p>
          <p>• At the start of each time period (3AM, 12PM, 6PM)</p>
          <p>• When tasks are incomplete halfway through a period</p>
        </div>
      </CardContent>
    </Card>
  );
} 