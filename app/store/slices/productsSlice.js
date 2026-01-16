import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = 'http://localhost:3001'


export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await axios.get(`${API_URL}/products`)
    return response.data
  }
)


export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData) => {
    const response = await axios.post(`${API_URL}/products`, productData)
    return response.data
  }
)

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async({ id, ...productData }) => {
    const response = await axios.put(`${API_URL}/products/${id}`, productData)
    return response.data
  }
)

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async(id) =>{
    await axios.delete(`${API_URL}/products/${id}`)
    return id
  }
)