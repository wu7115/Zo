'use client';

import React, { useState, useEffect } from 'react';
import { PostCard, Post } from './PostCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { app } from '@/lib/firebase';

export function PostsSection() {
  const [posts, setPosts] = useState<Post[]>([]);

  // List of images to use for posts, in order
  const postImages = [
    '/images/posts/ride_bike.jpeg',
    '/images/posts/yoga.jpeg',
    '/images/posts/exercise.jpeg',
    '/images/posts/diet.jpeg',
    '/images/posts/ride_bike2.jpeg',
    '/images/posts/person_in_sunset.png',
    '/images/posts/sunset.png',
  ];

  useEffect(() => {
    // --- Firestore real-time posts listener ---
    const auth = getAuth(app);
    if (!auth.currentUser) return;
    const db = getFirestore(app);
    const postsRef = collection(db, 'users', auth.currentUser.uid, 'posts');
    const q = query(postsRef, orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firestorePosts = snapshot.docs.map(doc => {
        const data = doc.data();
        let timestampStr = '';
        if (data.timestamp && typeof data.timestamp.toDate === 'function') {
          timestampStr = data.timestamp.toDate().toISOString();
        } else if (typeof data.timestamp === 'string') {
          timestampStr = data.timestamp;
        } else {
          timestampStr = new Date().toISOString();
        }
        return {
          id: doc.id,
          text: data.text || '',
          image: data.image || null,
          timestamp: timestampStr,
          likes: typeof data.likes === 'number' ? data.likes : 0,
          comments: Array.isArray(data.comments) ? data.comments : [],
        };
      });
      setPosts(firestorePosts);
    });
    return () => unsubscribe();
  }, []);

  const handleLike = (postId: string) => {
    // Update like count in localStorage
    try {
      const storedPosts = JSON.parse(localStorage.getItem('userPosts') || '[]');
      const updatedPosts = storedPosts.map((post: Post) => {
        if (post.id === postId) {
          return { ...post, likes: post.likes + 1 };
        }
        return post;
      });
      localStorage.setItem('userPosts', JSON.stringify(updatedPosts));
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleComment = (postId: string) => {
    // TODO: Implement comment functionality
    console.log('Comment on post:', postId);
  };

  const handleShare = (postId: string) => {
    // TODO: Implement share functionality
    console.log('Share post:', postId);
  };

  if (posts.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <MessageSquare className="h-5 w-5 mr-2" />
            Your Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No posts yet</p>
            <p className="text-xs mt-1">Create your first post using the + button in the header</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <MessageSquare className="h-5 w-5 mr-2" />
          Your Posts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
          />
        ))}
      </CardContent>
    </Card>
  );
} 