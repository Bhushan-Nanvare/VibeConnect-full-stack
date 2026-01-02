import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { Pencil } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../features/user/userSlice';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

const ProfileModal = ({setShowEdit}) => {

    const dispatch = useDispatch();
    const {getToken} = useAuth()

    const user = useSelector((state) => state.user.value)
    const [editForm, setEditForm] = useState({
        username: user.username || '',
        bio: user.bio || '',
        location: user.location || '',
        profile_picture: null,
        cover_photo: null,
        full_name: user.full_name || '',
        interaction_style_badges: user.interaction_style_badges || [],
        message_comfort_level: user.message_comfort_level || 'open',
        request_openness: user.request_openness || 'open',
        energy_mode: user.energy_mode || 'normal',
        energy_mode_expires_at: user.energy_mode_expires_at || null,
        newBadge: '',
    })

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {

            const userData = new FormData();
            const {full_name, username, bio, location, profile_picture, cover_photo, interaction_style_badges, message_comfort_level, request_openness, energy_mode, energy_mode_expires_at} = editForm

            userData.append('username', username);
            userData.append('bio', bio);
            userData.append('location', location);
            userData.append('full_name', full_name);
            userData.append('interaction_style_badges', JSON.stringify(interaction_style_badges));
            userData.append('message_comfort_level', message_comfort_level);
            userData.append('request_openness', request_openness);
            userData.append('energy_mode', energy_mode);
            if(energy_mode_expires_at) {
                userData.append('energy_mode_expires_at', energy_mode_expires_at);
            }
            profile_picture && userData.append('profile', profile_picture)
            cover_photo && userData.append('cover', cover_photo)

            const token = await getToken()
            dispatch(updateUser({userData, token}))

            setShowEdit(false)
        } catch (error) {
            toast.error(error.message)
        }
    }

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-110 h-screen overflow-y-scroll bg-black/50'>
      <div className='max-w-2xl sm:py-6 mx-auto'>
        <div className='bg-white rounded-lg shadow p-6'>
            <h1 className='text-2xl font-bold text-gray-900 mb-6'>Edit Profile</h1>

            <form className='space-y-4' onSubmit={e=> toast.promise(
                handleSaveProfile(e), {loading: 'Saving...'}
            )}>
                {/* Profile Picture */}
                <div className='flex flex-col items-start gap-3'>
                    <label htmlFor="profile_picture" className='block text-sm font-medium text-gray-700 mb-1'>
                        Profile Picture
                        <input hidden type="file" accept="image/*" id="profile_picture" className="w-full p-3 border border-gray-200 rounded-lg" onChange={(e)=>setEditForm({...editForm, profile_picture: e.target.files[0]})}/>
                        <div className='group/profile relative'>
                            <img src={editForm.profile_picture ? URL.createObjectURL(editForm.profile_picture) : user.profile_picture} alt="" className='w-24 h-24 rounded-full object-cover mt-2'/>

                            <div className='absolute hidden group-hover/profile:flex top-0 left-0 right-0 bottom-0 bg-black/20 rounded-full items-center justify-center'>
                                <Pencil className="w-5 h-5 text-white"/>
                            </div>
                        </div>
                    </label>
                </div>

            {/* Cover Photo */}
            <div className='flex flex-col items-start gap-3'>
                <label htmlFor="cover_photo" className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Photo
                    <input hidden type="file" accept="image/*" id="cover_photo" className="w-full p-3 border border-gray-200 rounded-lg" onChange={(e)=>setEditForm({...editForm, cover_photo: e.target.files[0]})}/>
                    <div className='group/cover relative'>
                        <img src={editForm.cover_photo ? URL.createObjectURL(editForm.cover_photo) : user.cover_photo} alt="" className='w-80 h-40 rounded-lg bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 object-cover mt-2'/>

                        <div className='absolute hidden group-hover/cover:flex top-0 left-0 right-0 bottom-0 bg-black/20 rounded-lg items-center justify-center'>
                            <Pencil className="w-5 h-5 text-white"/>
                        </div>
                    </div>
                </label>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                </label>
                <input type="text" className='w-full p-3 border border-gray-200 rounded-lg' placeholder='Please enter your full name' onChange={(e)=>setEditForm({...editForm, full_name: e.target.value})} value={editForm.full_name}/>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                </label>
                <input type="text" className='w-full p-3 border border-gray-200 rounded-lg' placeholder='Please enter a username' onChange={(e)=>setEditForm({...editForm, username: e.target.value})} value={editForm.username}/>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                </label>
                <textarea rows={3} className='w-full p-3 border border-gray-200 rounded-lg' placeholder='Please enter a short bio' onChange={(e)=>setEditForm({...editForm, bio: e.target.value})} value={editForm.bio}/>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                </label>
               <input type="text" className='w-full p-3 border border-gray-200 rounded-lg' placeholder='Please enter your location' onChange={(e)=>setEditForm({...editForm, location: e.target.value})} value={editForm.location}/>
            </div>

            {/* Social Signals Section */}
            <div className='border-t border-gray-200 pt-4 mt-4'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Social Signals</h3>
                
                {/* Interaction Style Badges */}
                <div className='mb-4'>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Interaction Style Badges
                    </label>
                    <div className='flex flex-wrap gap-2 mb-2'>
                        {editForm.interaction_style_badges.map((badge, idx) => (
                            <span key={idx} className='text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-2.5 py-1 flex items-center gap-1'>
                                {badge}
                                <button 
                                    type="button"
                                    onClick={() => setEditForm({...editForm, interaction_style_badges: editForm.interaction_style_badges.filter((_, i) => i !== idx)})}
                                    className='text-indigo-700 hover:text-indigo-900'
                                >×</button>
                            </span>
                        ))}
                    </div>
                    <div className='flex gap-2'>
                        <input 
                            type="text" 
                            className='flex-1 p-2 border border-gray-200 rounded-lg text-sm' 
                            placeholder='Add a badge (e.g., early-bird)'
                            value={editForm.newBadge}
                            onChange={(e)=>setEditForm({...editForm, newBadge: e.target.value})}
                            onKeyDown={(e) => {
                                if(e.key === 'Enter' && editForm.newBadge.trim()) {
                                    e.preventDefault();
                                    setEditForm({
                                        ...editForm, 
                                        interaction_style_badges: [...editForm.interaction_style_badges, editForm.newBadge.trim()],
                                        newBadge: ''
                                    });
                                }
                            }}
                        />
                        <button 
                            type="button"
                            onClick={() => {
                                if(editForm.newBadge.trim()) {
                                    setEditForm({
                                        ...editForm, 
                                        interaction_style_badges: [...editForm.interaction_style_badges, editForm.newBadge.trim()],
                                        newBadge: ''
                                    });
                                }
                            }}
                            className='px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm'
                        >Add</button>
                    </div>
                </div>

                {/* Message Comfort Level */}
                <div className='mb-4'>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message Comfort Level
                    </label>
                    <select 
                        className='w-full p-3 border border-gray-200 rounded-lg'
                        value={editForm.message_comfort_level}
                        onChange={(e)=>setEditForm({...editForm, message_comfort_level: e.target.value})}
                    >
                        <option value="open">Open - Anyone can message</option>
                        <option value="selective">Selective - Only connections</option>
                        <option value="closed">Closed - Not accepting messages</option>
                    </select>
                </div>

                {/* Request Openness */}
                <div className='mb-4'>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Connection Request Openness
                    </label>
                    <select 
                        className='w-full p-3 border border-gray-200 rounded-lg'
                        value={editForm.request_openness}
                        onChange={(e)=>setEditForm({...editForm, request_openness: e.target.value})}
                    >
                        <option value="open">Open - Anyone can connect</option>
                        <option value="connections_only">Connections Only</option>
                        <option value="closed">Closed - Not accepting requests</option>
                    </select>
                </div>

                {/* Energy Mode */}
                <div className='mb-4'>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Energy Mode
                    </label>
                    <select 
                        className='w-full p-3 border border-gray-200 rounded-lg mb-2'
                        value={editForm.energy_mode}
                        onChange={(e)=>setEditForm({...editForm, energy_mode: e.target.value, energy_mode_expires_at: e.target.value === 'normal' ? null : editForm.energy_mode_expires_at})}
                    >
                        <option value="normal">Normal</option>
                        <option value="high">High Energy</option>
                        <option value="low">Low Energy</option>
                        <option value="focus">Focus Mode</option>
                        <option value="away">Away</option>
                    </select>
                    {editForm.energy_mode !== 'normal' && (
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">
                                Expires At (optional - leave empty for permanent)
                            </label>
                            <input 
                                type="datetime-local" 
                                className='w-full p-2 border border-gray-200 rounded-lg text-sm'
                                value={editForm.energy_mode_expires_at ? new Date(editForm.energy_mode_expires_at).toISOString().slice(0, 16) : ''}
                                onChange={(e)=>setEditForm({...editForm, energy_mode_expires_at: e.target.value ? new Date(e.target.value).toISOString() : null})}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className='flex justify-end space-x-3 pt-6'>

                <button onClick={()=> setShowEdit(false)} type='button' className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer'>Cancel</button>

                <button type='submit' className='px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition cursor-pointer'>Save Changes</button>
            </div>

            </form>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal
