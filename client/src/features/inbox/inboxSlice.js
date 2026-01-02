import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

const initialState = {
    items: [],
    loading: false,
    error: null
}

export const fetchInboxItems = createAsyncThunk('inbox/fetchInboxItems', async (token) => {
    const { data } = await api.get('/api/inbox', {
        headers: { Authorization: `Bearer ${token}` }
    })
    return data.success ? data.items : null
})

export const markItemRead = createAsyncThunk('inbox/markItemRead', async ({itemId, token}) => {
    const { data } = await api.put(`/api/inbox/${itemId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return data.success ? data.item : null
})

export const dismissItem = createAsyncThunk('inbox/dismissItem', async ({itemId, token}) => {
    const { data } = await api.put(`/api/inbox/${itemId}/dismiss`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    })
    return data.success ? data.item : null
})

const inboxSlice = createSlice({
    name: 'inbox',
    initialState,
    reducers: {
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item._id !== action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInboxItems.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchInboxItems.fulfilled, (state, action) => {
                state.loading = false
                if(action.payload) {
                    state.items = action.payload
                }
            })
            .addCase(fetchInboxItems.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(markItemRead.fulfilled, (state, action) => {
                if(action.payload) {
                    state.items = state.items.map(item => 
                        item._id === action.payload._id ? {...item, read: true} : item
                    )
                }
            })
            .addCase(dismissItem.fulfilled, (state, action) => {
                if(action.payload) {
                    state.items = state.items.filter(item => item._id !== action.payload._id)
                }
            })
    }
})

export const { removeItem } = inboxSlice.actions
export default inboxSlice.reducer


