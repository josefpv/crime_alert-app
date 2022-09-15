import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export const mapState = createSlice({
  name: "mapState",
  initialState: {
    center: { lat: -33.447282, lng: -70.665222 },
    marker: null,
    inputLocation: "",
    crimeType: 1,
    crimeDetails: "",
    crimeTypes: [],
    cuerrentDayEventsLocation: [],
    showInfoWindow: false,
    infoWindowData: {},
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
    setCuerrentDayEventsLocation: (state, action) => {
      state.cuerrentDayEventsLocation = action.payload;
    },
    setSelectedCrime: (state, action) => {
      state.crimeType = action.payload;
    },
    toogleInfoWindow: (state, action) => {
      state.showInfoWindow = !state.showInfoWindow;
    },
    setInfoWindowData: (state, action) => {
      state.infoWindowData = action.payload;
    },
    saveAlert: (state, action) => {},
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
  saveAlert,
  setCuerrentDayEventsLocation,
  toogleInfoWindow,
  setInfoWindowData,
} = mapState.actions;

export const fetchCrimeTypesAsyn = () => async (dispatch) => {
  const { data } = await axios.get("api/crimeTypes");
  console.log(data);
  dispatch(setCrimeType(data));
};

export const generateAlert = () => async (dispatch, getState) => {
  console.log("Alert generated!");
  const { marker, crimeType, crimeDetails } = getState().mapState;
  console.log(marker, crimeType, crimeDetails);

  const dataApi = {
    coors: marker,
    type_crime: crimeType,
    details: crimeDetails,
  };
  const { data } = await axios.post("api/alert/new", dataApi);
  if (data.completado) {
    toast.success("Alerta generada exitosamente.");
  } else {
    toast.error(
      "Ha ocurrido un error al intentar generar la alerta, por favor intente nuevamente."
    );
  }

  dispatch(saveAlert());
};

export const fetchCurrentDayEvents = () => async (dispatch) => {
  const { data } = await axios.get("api/alerts");
  /*
  let eventList = [];
  data.map((event) => {
    eventList = [...eventList, event.coors];
  });
  console.log(eventList);
  */
  dispatch(setCuerrentDayEventsLocation(data));
};

export default mapState.reducer;
