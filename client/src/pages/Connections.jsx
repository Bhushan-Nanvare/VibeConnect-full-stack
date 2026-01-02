import React, { useEffect, useState } from 'react'
import {Users, UserPlus, UserCheck, UserRoundPen, MessageSquare} from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux'
import { useAuth } from '@clerk/clerk-react';
import { fetchConnections } from '../features/connections/connectionsSlice';
import api from '../api/axios';
import toast from 'react-hot-toast';
import RequestOpennessBadge from '../components/RequestOpennessBadge';
import EnergyModeBadge from '../components/EnergyModeBadge';

const Connections = () => {

  const [currentTab, setCurrentTab] = useState('Followers')

  const navigate = useNavigate()
  const { getToken } = useAuth()
  const dispatch = useDispatch()

  const {connections, pendingConnections, followers, following} = useSelector((state)=>state.connections)

  const dataArray = [
    {label: 'Followers', value: followers, icon: Users },
    {label: 'Following', value: following, icon: UserCheck },
    {label: 'Pending', value: pendingConnections, icon: UserRoundPen },
    {label: 'Connections', value: connections, icon: UserPlus },
  ]

  const handleUnfollow = async (userId) => {
    try {
      const { data } = await api.post('/api/user/unfollow', {id: userId}, {
        headers: { Authorization: `Bearer ${await getToken()}`}
      })
      if (data.success){
        toast.success(data.message)
        dispatch(fetchConnections(await getToken()))
      }else{
        toast(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

   const acceptConnection = async (userId) => {
    try {
      const { data } = await api.post('/api/user/accept', {id: userId}, {
        headers: { Authorization: `Bearer ${await getToken()}`}
      })
      if (data.success){
        toast.success(data.message)
        dispatch(fetchConnections(await getToken()))
      }else{
        toast(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    getToken().then((token)=>{
      dispatch(fetchConnections(token))
    })
  },[])

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-6xl mx-auto p-6'>

      {/* Title */}
      <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-800 mb-2'>Connections</h1>
          <p className='text-slate-600 text-base'>Manage your network and discover new connections</p>
      </div>

      {/* Statistics Cards */}
      <div className='mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {dataArray.map((item, index)=>(
          <div key={index} className='bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center'>
            <div className='text-4xl font-bold text-slate-800 mb-2'>{item.value.length}</div>
            <p className='text-sm text-slate-600 font-medium'>{item.label}</p>
          </div>
        ))}
      </div>

       {/* Tab Navigation */}
       <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-2 mb-6 flex items-center gap-1'>
        {
          dataArray.map((tab)=>(
            <button 
              onClick={()=> setCurrentTab(tab.label)} 
              key={tab.label} 
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                currentTab === tab.label 
                  ? 'bg-slate-100 text-slate-800 shadow-sm' 
                  : 'text-gray-500 hover:text-slate-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${currentTab === tab.label ? 'text-slate-800' : 'text-gray-400'}`}/>
              <span>{tab.label}</span>
            </button>
          ))
        }
       </div>

       {/* Connections List */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {dataArray.find((item)=>item.label === currentTab).value.map((user)=>(
            <div key={user._id} className='bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200'>
              <div className='flex flex-col items-center text-center mb-4 relative'>
                <div className='relative inline-block'>
                  <img src={user.profile_picture} alt={user.full_name} className="rounded-full w-16 h-16 object-cover shadow-md mb-3"/>
                  {user.energy_mode && user.energy_mode !== 'normal' && (
                    <EnergyModeBadge energyMode={user.energy_mode} expiresAt={user.energy_mode_expires_at} variant='dot' size='xs' />
                  )}
                </div>
                <p className="font-semibold text-slate-800 text-base">{user.full_name}</p>
                <p className="text-sm text-slate-500">@{user.username}</p>
                {user.bio && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{user.bio}</p>
                )}
                <RequestOpennessBadge openness={user.request_openness} variant='text' />
              </div>
              <div className='flex flex-col gap-2'>
                <button 
                  onClick={()=> navigate(`/profile/${user._id}`)} 
                  className='w-full py-2.5 px-4 text-sm font-medium rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition-all text-white shadow-sm'
                >
                  View Profile
                </button>
                {
                  currentTab === 'Following' && (
                    <button 
                      onClick={()=> handleUnfollow(user._id)} 
                      className='w-full py-2.5 px-4 text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition-all'
                    >
                      Unfollow
                    </button>
                  )
                }
                {
                  currentTab === 'Pending' && (
                    <button 
                      onClick={()=>acceptConnection(user._id)} 
                      className='w-full py-2.5 px-4 text-sm font-medium rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 active:scale-95 transition-all'
                    >
                      Accept
                    </button>
                  )
                }
                {
                  currentTab === 'Connections' && (
                    <button 
                      onClick={()=> navigate(`/messages/${user._id}`)} 
                      className='w-full py-2.5 px-4 text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2'
                    >
                      <MessageSquare className='w-4 h-4'/>
                      Message
                    </button>
                  )
                }
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Connections
