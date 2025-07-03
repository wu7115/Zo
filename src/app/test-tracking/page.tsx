'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTrackingData } from '@/hooks/use-tracking-data';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';

export default function TestTrackingPage() {
  const [user, setUser] = useState<any>(null);
  const { 
    priorities, 
    dailyAnswers, 
    isLoading, 
    updateAnswer, 
    isTaskCompleted,
    savePriorities,
    getCompletionStats 
  } = useTrackingData();

  const [completionStats, setCompletionStats] = useState<any>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleTestUpdate = async () => {
    // Test updating a tracking answer
    await updateAnswer('test-task-1', 'test-value');
  };

  const handleTestPriorities = async () => {
    // Test saving priorities
    const testPriorities = {
      morning: {
        'test-task-1': 'high' as const,
        'test-task-2': 'medium' as const,
      },
      afternoon: {
        'test-task-3': 'low' as const,
      }
    };
    await savePriorities(testPriorities);
  };

  const handleGetStats = async () => {
    const stats = await getCompletionStats();
    setCompletionStats(stats);
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading tracking data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Tracking Service Test</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Logged in:</strong> {user ? 'Yes' : 'No'}</p>
            <p><strong>User ID:</strong> {user?.uid || 'Not logged in'}</p>
            <p><strong>Email:</strong> {user?.email || 'Not logged in'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loading Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priorities</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-2 rounded overflow-auto">
              {JSON.stringify(priorities, null, 2)}
            </pre>
            <Button onClick={handleTestPriorities} className="mt-2">
              Test Save Priorities
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Answers</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-2 rounded overflow-auto">
              {JSON.stringify(dailyAnswers, null, 2)}
            </pre>
            <Button onClick={handleTestUpdate} className="mt-2">
              Test Update Answer
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>test-task-1 completed:</strong> {isTaskCompleted('test-task-1') ? 'Yes' : 'No'}</p>
            <p><strong>test-task-2 completed:</strong> {isTaskCompleted('test-task-2') ? 'Yes' : 'No'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completion Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            {completionStats ? (
              <div>
                <p><strong>Completed:</strong> {completionStats.completed}</p>
                <p><strong>Total:</strong> {completionStats.total}</p>
                <p><strong>Percentage:</strong> {completionStats.percentage.toFixed(1)}%</p>
              </div>
            ) : (
              <p>No stats loaded</p>
            )}
            <Button onClick={handleGetStats} className="mt-2">
              Get Completion Stats
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 