'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, Sun, SunMedium, Moon, TestTube } from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';
import { getCurrentTimePeriod } from '@/hooks/use-notifications';

export function NotificationTestControls() {
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

  const triggerTestNotification = (type: 'new-period' | 'incomplete-tasks', timePeriod: 'morning' | 'afternoon' | 'evening') => {
    const now = new Date();
    const testNotification = {
      id: `test-${type}-${timePeriod}-${now.getTime()}`,
      type,
      title: type === 'new-period' 
        ? `Test: New ${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} Tasks Available`
        : `Test: Complete Your ${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} Tasks`,
      message: type === 'new-period'
        ? `This is a test notification for ${timePeriod} tasks.`
        : `This is a test reminder for incomplete ${timePeriod} tasks.`,
      timePeriod,
      timestamp: now,
      read: false,
    };

    // Add to notifications (this would normally be done through the hook)
    console.log('Test notification created:', testNotification);
    
    // Show toast notification
    const { toast } = require('@/hooks/use-toast');
    toast({
      title: testNotification.title,
      description: testNotification.message,
      duration: 5000,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <TestTube className="h-4 w-4" />
          Test Controls
          <Badge variant="outline" className="ml-auto text-xs">
            {notifications.length} total, {unreadCount} unread
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerTestNotification('new-period', 'morning')}
            className="text-xs"
          >
            <Sun className="h-3 w-3 mr-1" />
            Morning New
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerTestNotification('new-period', 'afternoon')}
            className="text-xs"
          >
            <SunMedium className="h-3 w-3 mr-1" />
            Afternoon New
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerTestNotification('new-period', 'evening')}
            className="text-xs"
          >
            <Moon className="h-3 w-3 mr-1" />
            Evening New
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => triggerTestNotification('incomplete-tasks', currentPeriod)}
            className="text-xs"
          >
            <Clock className="h-3 w-3 mr-1" />
            Incomplete Tasks
          </Button>
        </div>

        <div className="flex gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex-1 text-xs"
          >
            <Bell className="h-3 w-3 mr-1" />
            Mark All Read
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
            className="flex-1 text-xs"
          >
            Clear All
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          <p>Current period: <Badge className={getTimePeriodColor(currentPeriod)}>
            {React.createElement(getTimePeriodIcon(currentPeriod), { className: "h-2 w-2 mr-1" })}
            {currentPeriod}
          </Badge></p>
          <p className="mt-1">Click buttons above to test different notification types</p>
        </div>
      </CardContent>
    </Card>
  );
} 