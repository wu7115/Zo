'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, ImagePlus, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '@/lib/firebase';

interface PostComposerModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function PostComposerModal({ isOpen, onOpenChange }: PostComposerModalProps) {
  const [postText, setPostText] = React.useState('');
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  React.useEffect(() => {
    // Clean up the object URL when the component unmounts or imagePreview changes
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const resetForm = () => {
    setPostText('');
    setImageFile(null);
    if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
  };

  const handleOpenModalChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const handlePost = async () => {
    const auth = getAuth(app);
    if (!auth.currentUser) {
      toast({ title: 'Error', description: 'You must be signed in to post.', variant: 'destructive' });
      return;
    }
    let imageUrl = null;
    if (imageFile) {
      try {
        const storage = getStorage(app);
        const imgRef = storageRef(storage, `users/${auth.currentUser.uid}/posts/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imgRef, imageFile);
        imageUrl = await getDownloadURL(imgRef);
      } catch (err) {
        toast({ title: 'Error', description: 'Failed to upload image.', variant: 'destructive' });
        return;
      }
    }
    const newPost = {
      text: postText,
      image: imageUrl,
      timestamp: serverTimestamp(),
      likes: 0,
      comments: [],
    };
    try {
      const db = getFirestore(app);
      await addDoc(collection(db, 'users', auth.currentUser.uid, 'posts'), newPost);
      toast({ title: 'Post Submitted!', description: 'Your post has been shared successfully.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save your post. Please try again.', variant: 'destructive' });
      return;
    }
    handleOpenModalChange(false);
  };

  const canPost = postText.trim().length > 0 || imageFile !== null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenModalChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[392px] bg-card"> {/* Adjusted max-width */}
        <DialogHeader>
          <DialogTitle className="text-primary font-headline text-xl">Create Post</DialogTitle>
          <DialogDescription>Share an update with your connections.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="What's on your mind?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            className="min-h-[100px] bg-background"
          />
          <div className="space-y-2">
            <Label htmlFor="photo-upload" className="text-sm font-medium text-primary">Add Photo (Optional)</Label>
            <Input
              id="photo-upload"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            {!imagePreview && (
                 <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full justify-start text-primary hover:bg-muted/50">
                    <ImagePlus className="mr-2 h-5 w-5" /> Choose Photo
                 </Button>
            )}
           
            {imagePreview && (
              <div className="relative group w-full aspect-video border rounded-md overflow-hidden">
                <Image src={imagePreview} alt="Selected preview" layout="fill" objectFit="contain" />
                <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-7 w-7 opacity-70 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                        setImageFile(null);
                        if (imagePreview && imagePreview.startsWith('blob:')) {
                            URL.revokeObjectURL(imagePreview);
                        }
                        setImagePreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                >
                    <XCircle className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handlePost} disabled={!canPost}>
            Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
