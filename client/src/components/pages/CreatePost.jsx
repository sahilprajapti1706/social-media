import React, { useContext, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '@/context/UserContext';
import MainLayout from "../MainLayout";

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { fetchAllPost } = useContext(UserContext);

  const handleTagInput = (e) => {
    setTagInput(e.target.value.trim().replace(/\s+/g, ''));
  };

  const addTag = (e) => {
    e.preventDefault();
    const newTag = tagInput.trim();

    if (!newTag || tags.includes(newTag) || tags.length >= 5) {
      toast({
        title: tags.length >= 5 ? "Maximum 5 tags allowed" : "Invalid tag",
        variant: "destructive",
      });
      return;
    }

    setTags((prevTags) => [...prevTags, newTag]);
    setTagInput('');
  };

  const removeTag = useCallback((tagToRemove) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast({
        title: "Content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await api.post(
        '/post/create-post',
        { content: content.trim(), tags }
      );

      if (response.status === 201) {
        toast({ title: response.data.message });
        setContent('');
        setTags([]);
        fetchAllPost(); // Refresh the posts
        navigate("/home");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast({
        title: "Failed to create post",
        description: error.response?.data?.message || "An error occurred. Try again!",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto transition-colors duration-300">
        <Card className="bg-card text-card-foreground border-border shadow-md rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="text-2xl font-bold text-foreground">Create New Post</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Content Input */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground/80 tracking-wide uppercase">Content</label>
                <Textarea
                  placeholder="What's on your mind? Share your story..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px] bg-muted border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/20 rounded-2xl p-4 text-lg resize-none"
                />
              </div>

              {/* Tags Input */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-foreground/80 tracking-wide uppercase">Tags</label>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-muted/30 rounded-xl border border-dashed border-border">
                  {tags.length > 0 ? tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full border border-primary/20 group animate-in fade-in zoom-in duration-200"
                    >
                      <span className="font-bold text-sm">#{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-primary/60 hover:text-primary transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )) : (
                    <span className="text-sm text-muted-foreground/60 italic px-2 self-center">No tags added yet</span>
                  )}
                </div>
                <div className="flex gap-3">
                  <Input
                    placeholder="Type tag and press Enter..."
                    value={tagInput}
                    onChange={handleTagInput}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(e);
                      }
                    }}
                    className="flex-1 bg-muted border-border text-foreground rounded-xl h-12"
                  />
                  <Button type="button" onClick={addTag} variant="outline" className="h-12 px-6 rounded-xl border-border hover:bg-muted font-bold transition-all">
                    Add Tag
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 px-1">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Maximum 5 tags allowed. Use relevant keywords for better reach.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-border">
                <Button type="submit" className="w-full bg-primary text-primary-foreground font-black text-lg rounded-2xl py-8 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-primary/20">
                  Create Post
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CreatePost;
