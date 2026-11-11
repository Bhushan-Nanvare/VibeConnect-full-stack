import React, { useEffect, useState } from 'react'
import { dummyStoriesData } from '../assets/assets'
import { Plus } from 'lucide-react'
import moment from 'moment'
import StoryModal from './StoryModal'
import StoryViewer from './StoryViewer'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

const StoriesBar = () => {

    const {getToken} = useAuth()

    const [stories, setStories] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [viewStory, setViewStory] = useState(null)

    const fetchStories = async () => {
        try {
            const token = await getToken()
            const { data } = await api.get('/api/story/get', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success){
                setStories(data.stories)
            }else{
                toast(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        fetchStories()
    },[])

  return (
    <>
      <div className='bg-white max-w-xs p-4 rounded-lg shadow'>
        <h3 className='font-semibold text-slate-800 mb-4'>Stories</h3>
        <div className='flex gap-3 overflow-x-auto no-scrollbar pb-2'>
          {/* Add Story Card */}
          <div onClick={()=>setShowModal(true)} className='flex-shrink-0 rounded-lg shadow-sm w-24 h-32 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center'>
            <div className='flex flex-col items-center justify-center'>
              <div className='size-8 bg-indigo-500 rounded-full flex items-center justify-center mb-2'>
                <Plus className='w-4 h-4 text-white'/>
              </div>
              <p className='text-xs font-medium text-slate-700 text-center'>Create</p>
            </div>
          </div>
          {/* Story Cards */}
          {
            stories.map((story, index)=> (
              <div onClick={()=> setViewStory(story)} key={index} className={`relative flex-shrink-0 rounded-lg shadow w-24 h-32 cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-b from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 overflow-hidden`}>
                {
                  story.media_type !== 'text' ? (
                    <div className='absolute inset-0 rounded-lg bg-black overflow-hidden'>
                      {
                        story.media_type === "image" ? 
                        <img src={story.media_url} alt="" className='h-full w-full object-cover'/>
                        : 
                        <video src={story.media_url} className='h-full w-full object-cover'/>
                      }
                    </div>
                  ) : (
                    <div className='absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600'></div>
                  )
                }
                <div className='absolute bottom-2 left-2 right-2 z-10'>
                  <div className='flex flex-col items-center gap-1'>
                    <img src={story.user.profile_picture} alt="" className='size-6 rounded-full ring-2 ring-white'/>
                    <p className='text-white text-[10px] font-medium text-center truncate w-full'>{story.user.full_name.split(' ')[0]}</p>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Add Story Modal */}
      {showModal && <StoryModal setShowModal={setShowModal} fetchStories={fetchStories}/>}
      {/* View Story Modal */}
      {viewStory && <StoryViewer viewStory={viewStory} setViewStory={setViewStory}/>}
    </>
  )
}

export default StoriesBar
