import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

export const fetchPages = createAsyncThunk('pages/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/pages', { params });
    return res.data.data; // { items, pagination }
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load pages');
  }
});

export const fetchDashboardStats = createAsyncThunk('pages/dashboardStats', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/pages/dashboard/stats');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load stats');
  }
});

const pageSlice = createSlice({
  name: 'pages',
  initialState: {
    items: [],
    pagination: { page: 1, limit: 20, total: 0, totalPages: 1 },
    stats: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export default pageSlice.reducer;
