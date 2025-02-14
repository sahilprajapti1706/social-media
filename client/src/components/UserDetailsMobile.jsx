import React, { useContext } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Users, Heart, MessageCircle, Share2, ThumbsUp, SquarePen, BookOpen } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { UserContext } from '@/context/UserContext';
import { Link } from 'react-router-dom';

const UserDetailsMobile = () => {
    const { userData, profile } = useContext(UserContext);

    return (
        <div className="w-full px-4 block lg:hidden z-[99]">
            <Card className="sticky top-[90px]">
                <CardHeader>
                    <div className="flex flex-col items-center space-x-4 mb-4">
                        <Avatar className="h-20 w-20 mb-4">
                            <img src="./author3.png" alt="Profile" className="rounded-full" />
                        </Avatar>
                        <div>
                            <CardTitle>@{profile.username}</CardTitle>
                        </div>
                    </div>

                    <div className='flex justify-around mx-3'>
                        <CardTitle className="flex flex-col justify-center items-center">
                            <h2 className='text-gray-600 text-base'>Follower</h2>
                            <h2>{profile.followers.length}</h2>
                        </CardTitle>
                        <Separator orientation="vertical" className="h-10 mx-3 bg-gray-500" />
                        <CardTitle className="flex flex-col justify-center items-center">
                            <h2 className='text-gray-600 text-base'>Following</h2>
                            <h2>{profile.following.length}</h2>
                        </CardTitle>
                    </div>
                </CardHeader>
                <Separator className="w-[70%] mx-auto mb-3" />
                <CardContent>
                    <div className="space-y-2">
                        <Link to={"/profile"} className="flex items-center space-x-3">
                            <User size={25} />
                            <span>My Profile</span>
                        </Link>
                        <Separator className="w-[80%] mx-auto mb-3" />
                        <Link to={"/friends"} className="flex items-center space-x-3">
                            <Users size={25} />
                            <span>Friends</span>
                        </Link>
                        <Separator className="w-[80%] mx-auto mb-3" />
                        <Link to={"/my-post"} className="flex items-center space-x-3">
                            <BookOpen size={25} />
                            <span>My Posts</span>
                        </Link>
                        <Separator className="w-[80%] mx-auto mb-3" />
                        <Link to={"/create-post"} className="flex items-center space-x-3">
                            <SquarePen size={25} />
                            <span>Create Post</span>
                        </Link>
                        <Separator className="w-[80%] mx-auto mb-3" />
                        <Link to={"/my-liked-posts"} className="flex items-center space-x-3">
                            <ThumbsUp size={25} />
                            <span>Liked Posts</span>
                        </Link>
                        <Separator className="w-[80%] mx-auto mb-3" />
                        <Link to={"/my-comment-posts"} className="flex items-center space-x-3">
                            <MessageCircle size={25} />
                            <span>Comments</span>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default UserDetailsMobile
