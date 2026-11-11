import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth } from '../context/AuthContext'
import { fetchInboxItems } from '../features/inbox/inboxSlice'
import InboxItem from '../components/InboxItem'
import Loading from '../components/Loading'
import Suggestions from '../components/Suggestions'

const Inbox = () => {
  const dispatch = useDispatch()
  const { getToken } = useAuth()
  const { items, loading } = useSelector((state) => state.inbox)

  useEffect(() => {
    const loadInbox = async () => {
      const token = await getToken()
      dispatch(fetchInboxItems(token))
    }
    loadInbox()

    // Refresh inbox every 30 seconds
    const interval = setInterval(loadInbox, 30000)
    return () => clearInterval(interval)
  }, [dispatch, getToken])

  return !loading ? (
    <div className='h-full overflow-y-scroll no-scrollbar py-6 px-4'>
      <div className='max-w-7xl mx-auto flex gap-6'>
        {/* Center Inbox - Items */}
        <div className='flex-1 max-w-2xl mx-auto'>
          <h2 className='text-2xl font-bold text-slate-800 mb-6'>Inbox</h2>
          <div className='space-y-4'>
            {items.length > 0 ? (
              items.map((item) => (
                <InboxItem key={item._id} item={item} />
              ))
            ) : (
              <div className='bg-white rounded-xl shadow p-8 text-center'>
                <p className='text-gray-500'>Your inbox is empty</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Suggestions */}
        <div className='hidden xl:block w-80 sticky top-6 h-fit'>
          <Suggestions />
        </div>
      </div>
    </div>
  ) : <Loading />
}

export default Inbox


