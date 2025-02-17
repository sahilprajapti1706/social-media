import React, { useContext, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '@/context/UserContext';

const EditPost = () => {
  const { id } = useParams();
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { fetchAllPost } = useContext(UserContext);

  // Handle tag input
  const handleTagInput = (e) => {
    setTagInput(e.target.value.replace(/\s/g, ''));
  };

  // Add a tag
  const addTag = (e) => {
    e.preventDefault();
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      if (tags.length >= 5) {
        toast({ title: "Maximum 5 tags allowed", variant: "destructive" });
        return;
      }
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Fetch post data on component mount
  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/post/get-post/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        if (response.status === 200) {
          setContent(response.data.post.content);
          setTags(response.data.post.tags);
        }
      } catch (error) {
        toast({
          title: "Error loading post",
          description: error.response?.data?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    };

    getPost();
  }, [id]);

  // Update post
  const updatePost = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/post/update/${id}`,
        { content, tags },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (response.status === 200) {
        toast({ title: "Post updated successfully" });
        await fetchAllPost();
        navigate("/home");
      }
    } catch (error) {
      toast({
        title: "Cannot update the post",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Edit Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={updatePost} className="space-y-6">
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
                    <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                      <span>#{tag}</span>
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-blue-900">
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
                <p className="text-sm text-gray-500">Press Enter or click Add Tag to add a tag. Maximum 5 tags allowed.</p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button type="submit" className="w-full">Update</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditPost;
