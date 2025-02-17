import React, { useContext, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '@/context/UserContext';

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
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/post/create-post`,
        { content: content.trim(), tags },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
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
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create New Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Content Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              {/* Tags Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-blue-900"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add some relevant hashtags"
                    value={tagInput}
                    onChange={handleTagInput}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(e);
                      }
                    }}
                    className="flex-1"
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Add Tag
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Press Enter or click Add Tag to add a tag. Maximum 5 tags allowed.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button type="submit" className="w-full">
                  Create Post
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePost;
