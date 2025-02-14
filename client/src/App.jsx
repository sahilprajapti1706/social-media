import React from 'react'
import Navbar from './components/Navbar'
import SignUp from './components/SignUp'
import HomePage from './components/HomePage'
import { Routes, Route } from 'react-router-dom'
import SignIn from './components/SignIn'
import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from './context/UserContext'
import CreatePost from './components/pages/CreatePost'
import Feed from './components/Feed'
import MyProfile from './components/pages/MyProfile'
import EditPost from './components/pages/EditPost'
import MyPost from './components/pages/MyPost'
import MyLikedPost from './components/pages/MyLikedPost'
import MyCommentPost from './components/pages/MyCommentPost'
import Friends from './components/pages/Friend'
import ForgotPassword from './components/pages/ForgetPassword'
import ResetPassword from './components/pages/ResetPassword'

const App = () => {
  return (
    <div>
     
          <Navbar/>
          <Routes>
                <Route path='/sign-up' element={<SignUp/>} />
                <Route path='/sign-in' element={<SignIn/>} />
                <Route path="/home" element={<HomePage/>} />
                <Route path='/create-post' element={<CreatePost/>}/>
                <Route path='/edit/:id' element={<EditPost/>}/>
                <Route path='/my-post' element={<MyPost/>}/>
                <Route path='/my-liked-posts' element={<MyLikedPost/>}/>
                <Route path='/my-comment-posts' element={<MyCommentPost/>}/>
                <Route path='/friends' element={<Friends/>}/>
                <Route path='/profile' element={<MyProfile/>}/>
                <Route path='/forgot-password' element={<ForgotPassword/>}/>
                <Route path='/reset-password' element={<ResetPassword/>}/>
          </Routes>
          <Toaster />
    
    </div>
  )
}

export default App