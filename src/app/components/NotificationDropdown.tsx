'use client';

import React from 'react';
import { Bell, Clock, CheckCircle2, Trash2, Sun, SunMedium, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { useNotifications, type Notification } from '@/hooks/use-notifications';
import { useRouter } from 'next/navigation';

const getTimePeriodIcon = (timePeriod: 'morning' | 'afternoon' | 'evening') => {
  switch (timePeriod) {
    case 'morning': return Sun;
    case 'afternoon': return SunMedium;
    case 'evening': return Moon;
  }
};

const getTimePeriodColor = (timePeriod: 'morning' | 'afternoon' | 'evening') => {
  switch (timePeriod) {
    case 'morning': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    case 'afternoon': return 'text-blue-600 bg-blue-100 border-blue-200';
    case 'evening': return 'text-purple-600 bg-purple-100 border-purple-200';
  }
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead }) => {
  const router = useRouter();
  const TimePeriodIcon = getTimePeriodIcon(notification.timePeriod);
  
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    
    // Navigate to track page for task-related notifications
    if (notification.type === 'incomplete-tasks' || notification.type === 'new-period') {
      router.push('/track');
    }
  };

  return (
    <DropdownMenuItem 
      className={cn(
        "flex flex-col items-start p-3 cursor-pointer hover:bg-muted/50 transition-colors",
        !notification.read && "bg-blue-50/50 border-l-2 border-l-blue-500"
      )}
      onClick={handleClick}
    >
      <div className="flex items-start w-full gap-3">
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border",
          getTimePeriodColor(notification.timePeriod)
        )}>
          <TimePeriodIcon className="w-4 h-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className={cn(
              "text-sm font-medium truncate",
              !notification.read && "font-semibold"
            )}>
              {notification.title}
            </h4>
            <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
              {formatTime(notification.timestamp)}
            </span>
          </div>
          
          <p className="text-xs text-muted-foreground line-clamp-2">
            {notification.message}
          </p>
          
          <div className="flex items-center gap-2 mt-2">
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs px-2 py-0.5",
                getTimePeriodColor(notification.timePeriod)
              )}
            >
              {notification.timePeriod.charAt(0).toUpperCase() + notification.timePeriod.slice(1)}
            </Badge>
            
            {notification.type === 'new-period' && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-green-100 text-green-700">
                New
              </Badge>
            )}
            
            {notification.type === 'incomplete-tasks' && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700">
                Reminder
              </Badge>
            )}
          </div>
        </div>
      </div>
    </DropdownMenuItem>
  );
};

export function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAllNotifications } = useNotifications();
  const router = useRouter();

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleClearAll = () => {
    clearAllNotifications();
  };

  const handleViewAll = () => {
    router.push('/track');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:text-accent relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-background"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications yet</p>
            <p className="text-xs">You'll see notifications for new tasks and reminders here</p>
          </div>
        ) : (
          <>
            <div className="max-h-64 overflow-y-auto">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                />
              ))}
            </div>
            
            <DropdownMenuSeparator />
            
            <div className="flex items-center justify-between p-2">
              <div className="flex gap-1">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={handleMarkAllAsRead}
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Mark all read
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={handleViewAll}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  View tasks
                </Button>
              </div>
              
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                  onClick={handleClearAll}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear all
                </Button>
              )}
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 