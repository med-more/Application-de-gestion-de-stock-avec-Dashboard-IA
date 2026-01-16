import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API_URL = 'http://localhost:3001'

export const fetchStats = createAsyncThunk(
    'sales/fetchSales',
    async () => {
        const response = await axios.get(`${API_URL}/sales`)
        return response.data
    }
)