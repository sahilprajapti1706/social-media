import React, { useContext } from "react";
import UserDetails from "./UserDetails";
import Suggestion from "./Suggestion";
import { UserContext } from "@/context/UserContext";

const MainLayout = ({ children }) => {
    const { profile, posts } = useContext(UserContext);

    // Extract trending tags
    const trendingTags = Array.from(
        new Set(posts.flatMap(post => post.tags || []))
    ).slice(0, 10);

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-4 gap-8">

                    {/* Left Sidebar */}
                    <div className="hidden lg:block lg:col-span-4 xl:col-span-1">
                        <div className="sticky top-[100px] space-y-6">
                            {profile ? (
                                <UserDetails />
                            ) : (
                                <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                                    <h3 className="text-xl font-bold text-foreground mb-2 font-sans">Welcome to VibeVerse</h3>
                                    <p className="text-muted-foreground text-sm mb-6 leading-relaxed">Join our community to share your thoughts, connect with others, and discover trending topics.</p>
                                    <div className="space-y-3">
                                        <button onClick={() => window.location.href = '/sign-up'} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all shadow-md active:scale-[0.98]">Sign Up Free</button>
                                        <button onClick={() => window.location.href = '/sign-in'} className="w-full py-3 border border-border text-foreground rounded-xl font-bold hover:bg-muted transition-all">Sign In</button>
                                    </div>
                                </div>
                            )}

                            {/* Trending Tags - Positioned below the user menu box */}
                            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                        </svg>
                                    </div>
                                    Trending Now
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {trendingTags.length > 0 ? trendingTags.map(tag => (
                                        <span key={tag} className="px-3 py-1.5 bg-muted text-muted-foreground text-xs font-bold rounded-full hover:bg-primary hover:text-primary-foreground cursor-pointer transition-all border border-transparent">
                                            #{tag}
                                        </span>
                                    )) : (
                                        <p className="text-muted-foreground text-sm italic">No active tags</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-1 lg:col-span-8 xl:col-span-2">
                        <div className="max-w-2xl mx-auto">
                            {children}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="hidden xl:block xl:col-span-1">
                        <div className="sticky top-[100px]">
                            {profile && <Suggestion />}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MainLayout;
