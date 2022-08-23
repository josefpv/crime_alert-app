import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const mapState = createSlice({
  name: "mapState",
  initialState: {
    center: { lat: -33.447282, lng: -70.665222 },
    marker: null,
    inputLocation: "",
    crimeType: 1,
    crimeDetails: "",
    crimeTypes: [],
  },
  reducers: {
    setCenter: (state, action) => {
      state.center = action.payload;
    },
    setMarker: (state, action) => {
      state.marker = action.payload;
    },
    setInputLocation: (state, action) => {
      state.inputLocation = action.payload;
    },
    setCrimeDetails: (state, action) => {
      state.crimeDetails = action.payload;
    },
    setCrimeType: (state, action) => {
      state.crimeTypes = action.payload;
    },
    setSelectedCrime: (state, action) => {
      state.crimeType = action.payload;
    },
  },
});

export const {
  setMap,
  setCenter,
  setMarker,
  setInputLocation,
  setCrimeDetails,
  setCrimeType,
  setSelectedCrime,
} = mapState.actions;

export const fetchCrimeTypesAsyn = () => async (dispatch) => {
  const { data } = await axios.get("api/crimeTypes");
  console.log(data);
  dispatch(setCrimeType(data));
};

export default mapState.reducer;
