import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios.js'
import toast from 'react-hot-toast'

const initialState = {
    capsules: [],
    loading: false,
    error: null
}

export const fetchCapsules = createAsyncThunk('capsules/fetchCapsules', async (token) => {
    const { data } = await api.get('/api/capsules', {
        headers: { Authorization: `Bearer ${token}` }
    })
    if (data.success) {
        return data.capsules
    } else {
        throw new Error(data.message || 'Failed to fetch capsules')
    }
})

export const createCapsule = createAsyncThunk('capsules/createCapsule', async ({ capsuleData, token }) => {
    const { data } = await api.post('/api/capsules/create', capsuleData, {
        headers: { Authorization: `Bearer ${token}` }
    })
    if (data.success) {
        toast.success('Time capsule created successfully')
        return data.capsule
    } else {
        toast.error(data.message || 'Failed to create capsule')
        throw new Error(data.message || 'Failed to create capsule')
    }
})

export const checkUnlockedCapsules = createAsyncThunk('capsules/checkUnlocked', async (token) => {
    const { data } = await api.post('/api/capsules/check-unlocked', {}, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return data.success ? data.unlockedCapsules : []
})

const capsuleSlice = createSlice({
    name: 'capsules',
    initialState,
    reducers: {
        updateCapsuleStatus: (state, action) => {
            const { capsuleId, status } = action.payload
            const capsule = state.capsules.find(c => c._id === capsuleId)
            if (capsule) {
                capsule.status = status
            }
        },
        resetCapsules: (state) => {
            state.capsules = []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCapsules.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchCapsules.fulfilled, (state, action) => {
                state.loading = false
                state.capsules = action.payload
            })
            .addCase(fetchCapsules.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(createCapsule.fulfilled, (state, action) => {
                state.capsules.unshift(action.payload)
            })
            .addCase(checkUnlockedCapsules.fulfilled, (state, action) => {
                action.payload.forEach(unlockedCapsule => {
                    const capsule = state.capsules.find(c => c._id === unlockedCapsule._id)
                    if (capsule) {
                        capsule.status = 'unlocked'
                    }
                })
            })
    }
})

export const { updateCapsuleStatus, resetCapsules } = capsuleSlice.actions

export default capsuleSlice.reducer
