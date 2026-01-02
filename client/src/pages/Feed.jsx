import React, { useEffect, useState } from 'react'
import { assets, dummyPostsData } from '../assets/assets'
import Loading from '../components/Loading'
import StoriesBar from '../components/StoriesBar'
import PostCard from '../components/PostCard'
import Suggestions from '../components/Suggestions'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const Feed = () => {

  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const {getToken} = useAuth()


  const fetchFeeds = async () => {
    try {
      setLoading(true)
      const {data} = await api.get('/api/post/feed', {headers: { Authorization: `Bearer ${await getToken()}` }})

      if (data.success){
        setFeeds(data.posts)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  useEffect(()=>{
    fetchFeeds()
  },[])

  return !loading ? (
    <div className='h-full overflow-y-scroll no-scrollbar py-6 px-4'>
      <div className='max-w-7xl mx-auto flex gap-6'>
        {/* Center Feed - Posts */}
        <div className='flex-1 max-w-2xl mx-auto'>
          <h2 className='text-2xl font-bold text-slate-800 mb-6'>Feeds</h2>
          <div className='space-y-6'>
            {feeds.map((post)=>(
              <PostCard key={post._id} post={post}/>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Stories, Suggestions */}
        <div className='hidden xl:block w-80 sticky top-6 h-fit'>
          <StoriesBar />
          <Suggestions />
        </div>
      </div>
    </div>
  ) : <Loading />
}

export default Feed
