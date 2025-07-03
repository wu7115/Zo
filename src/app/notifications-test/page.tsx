'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bell, Clock, Sun, SunMedium, Moon, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { NotificationDemo } from '@/app/components/NotificationDemo';
import { NotificationTestControls } from '@/app/components/NotificationTestControls';
import { useNotifications } from '@/hooks/use-notifications';
import { getCurrentTimePeriod } from '@/hooks/use-notifications';

export default function NotificationsTestPage() {
  const { notifications, unreadCount } = useNotifications();
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

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6 bg-app-content overflow-y-auto">
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/track">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl font-headline text-primary">Notification System</h1>
          </div>
          <Badge variant="outline" className={getTimePeriodColor(currentPeriod)}>
            {React.createElement(getTimePeriodIcon(currentPeriod), { className: "h-3 w-3 mr-1" })}
            {currentPeriod.charAt(0).toUpperCase() + currentPeriod.slice(1)}
          </Badge>
        </div>

        {/* Test Controls */}
        <NotificationTestControls />

        {/* Notification Demo */}
        <NotificationDemo />

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sun className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">New Time Period Notifications</h4>
                  <p className="text-xs text-muted-foreground">
                    Automatically triggered at the start of each time period (3AM, 12PM, 6PM) 
                    to remind users that new tasks are available.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Incomplete Task Reminders</h4>
                  <p className="text-xs text-muted-foreground">
                    Sent halfway through each time period when users have unfinished tasks 
                    to encourage completion.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bell className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Real-time Updates</h4>
                  <p className="text-xs text-muted-foreground">
                    Notifications appear as toast messages and in the dropdown, 
                    with unread counts and visual indicators.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium text-sm mb-2">Time Periods:</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className={`p-2 rounded border ${getTimePeriodColor('morning')}`}>
                  <div className="flex items-center gap-1 mb-1">
                    <Sun className="h-3 w-3" />
                    <span className="font-medium">Morning</span>
                  </div>
                  <span>3:00 AM - 11:59 AM</span>
                </div>
                <div className={`p-2 rounded border ${getTimePeriodColor('afternoon')}`}>
                  <div className="flex items-center gap-1 mb-1">
                    <SunMedium className="h-3 w-3" />
                    <span className="font-medium">Afternoon</span>
                  </div>
                  <span>12:00 PM - 5:59 PM</span>
                </div>
                <div className={`p-2 rounded border ${getTimePeriodColor('evening')}`}>
                  <div className="flex items-center gap-1 mb-1">
                    <Moon className="h-3 w-3" />
                    <span className="font-medium">Evening</span>
                  </div>
                  <span>6:00 PM - 2:59 AM</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Current Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Notifications:</span>
              <Badge variant="secondary">{notifications.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Unread Notifications:</span>
              <Badge variant="destructive">{unreadCount}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Current Time Period:</span>
              <Badge className={getTimePeriodColor(currentPeriod)}>
                {currentPeriod.charAt(0).toUpperCase() + currentPeriod.slice(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" asChild>
            <Link href="/track">
              <ClipboardList className="h-4 w-4 mr-2" />
              Back to Track
            </Link>
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
} 