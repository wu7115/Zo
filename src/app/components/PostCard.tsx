'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, MoreHorizontal, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Post {
  id: string;
  text: string;
  image?: string | null;
  timestamp: string;
  likes: number;
  comments: any[];
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

export function PostCard({ post, onLike, onComment, onShare }: PostCardProps) {
  const [isLiked, setIsLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.(post.id);
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return postTime.toLocaleDateString();
  };

  return (
    <Card className="w-full shadow-sm border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">You</p>
              <p className="text-xs text-muted-foreground">{formatTime(post.timestamp)}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        {post.text && (
          <p className="text-sm leading-relaxed">{post.text}</p>
        )}
        
        {post.image && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
            <Image
              src={post.image}
              alt="Post image"
              fill
              className="object-contain"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "h-8 px-2 text-xs",
                isLiked && "text-red-500"
              )}
            >
              <Heart className={cn("h-4 w-4 mr-1", isLiked && "fill-current")} />
              {likeCount > 0 && likeCount}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment?.(post.id)}
              className="h-8 px-2 text-xs"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.comments.length > 0 && post.comments.length}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare?.(post.id)}
              className="h-8 px-2 text-xs"
            >
              <Share2 className="h-4 w-4 mr-1" />
            </Button>
          </div>
          
          {post.comments.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 