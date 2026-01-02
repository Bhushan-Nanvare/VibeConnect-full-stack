import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios.js'
import toast from 'react-hot-toast'


const initialState = {
    value: null,
    loading: false,
    error: null
}

export const fetchUser = createAsyncThunk('user/fetchUser', async (token) => {
    const { data } = await api.get('/api/user/data', {
        headers: {Authorization: `Bearer ${token}`}
    })
    if (data.success) {
        return data.user
    } else {
        throw new Error(data.message || 'Failed to fetch user data')
    }
})

export const updateUser = createAsyncThunk('user/update', async ({userData ,token}) => {
    const { data } = await api.post('/api/user/update', userData, {
        headers: {Authorization: `Bearer ${token}`}
    })
    if(data.success){
        toast.success(data.message)
        return data.user
    }else{
        toast.error(data.message)
        return null
    }
})


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

    },
extraReducers: (builder) => {
  builder
    .addCase(fetchUser.pending, (state) => {
      state.loading = true
    })
    .addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false
      state.value = action.payload
    })
    .addCase(fetchUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
    .addCase(updateUser.fulfilled, (state, action) => {
      state.value = action.payload
    })
    .addCase(updateUser.rejected, (state, action) => {
      state.error = action.payload
    })
}
})

export default userSlice.reducer