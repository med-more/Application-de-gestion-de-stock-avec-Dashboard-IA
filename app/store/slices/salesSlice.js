import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API_URL = 'http://localhost:3001'

export const fetchSales = createAsyncThunk(
    'sales/fetchSales',
    async () => {
        const response = await axios.get(`${API_URL}/sales`)
        return response.data
    }
)

const salesSlace = createSlice({
    name: 'sales',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})