import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  MarkerClusterer,
  InfoWindow,
} from "@react-google-maps/api";
import {
  Box,
  Grid,
  Container,
  Stack,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";

import {
  setCenter,
  setMarker,
  setInputLocation,
  setCrimeDetails,
  setCrimeType,
  setSelectedCrime,
  fetchCrimeTypesAsyn,
  fetchCurrentDayEvents,
  generateAlert,
  toogleInfoWindow,
  setInfoWindowData,
} from "./../../store/features/mapState";
import clusterImg from "./../../images/theft.png";

export const Map = () => {
  const [map, setMap] = useState(null);
  const center = useSelector((state) => state.mapState.center);
  const marker = useSelector((state) => state.mapState.marker);
  const locationText = useSelector((state) => state.mapState.inputLocation);
  const crimeDetails = useSelector((state) => state.mapState.crimeDetails);
  const crimeType = useSelector((state) => state.mapState.crimeType);
  const crimeTypes = useSelector((state) => state.mapState.crimeTypes);
  const cuerrentDayEventsLocation = useSelector(
    (state) => state.mapState.cuerrentDayEventsLocation
  );
  const showInfoWindow = useSelector((state) => state.mapState.showInfoWindow);
  const infoWindowData = useSelector((state) => state.mapState.infoWindowData);

  const dispatch = useDispatch();

  const createMarker = async (coors) => {
    //dispatch(setCenter(coors));
    dispatch(setMarker(coors));
    map.panTo(coors);
  };

  const handleSearchLocation = () => {
    const placeService = new window.google.maps.places.PlacesService(map);
    const request = {
      query: locationText,
      fields: ["name", "geometry"],
    };

    placeService.findPlaceFromQuery(request, function (result, status) {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        createMarker({
          lat: result[0].geometry.location.lat(),
          lng: result[0].geometry.location.lng(),
        });
      } else {
        handleLocationNotFound();
      }
    });
  };

  const resetLocation = () => {
    dispatch(setMarker(null));
    dispatch(setInputLocation(""));
    dispatch(setCrimeDetails(""));
    dispatch(setSelectedCrime(1));
  };

  const handleLocationNotFound = () => {
    dispatch(setInputLocation(""));
    dispatch(setMarker(null));
    alert("Ubicacion no encontrada");
  };

  const handleLocationTextChange = (e) => {
    dispatch(setInputLocation(e.target.value));
  };

  const handleSaveAlert = () => {
    dispatch(generateAlert());
    resetLocation();
    dispatch(fetchCurrentDayEvents());
  };

  const createKey = (location) => {
    return location.lat + location.lng;
  };

  const handleInfoWindow = (infoEvent) => {
    dispatch(setInfoWindowData(infoEvent));
    dispatch(toogleInfoWindow());
  };

  const handleCloseInfoWindow = () => {
    dispatch(setInfoWindowData({}));
    dispatch(toogleInfoWindow());
  };

  useEffect(() => {
    dispatch(fetchCrimeTypesAsyn());
    dispatch(fetchCurrentDayEvents());
    const intervalo = setInterval(() => {
      dispatch(fetchCurrentDayEvents());
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    setMarker(center);
    /*
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords.latitude);
      console.log(position.coords.longitude);
    });
    */
  }, [center]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyATFx3hbKgU2UDCScJaeQBSM6pmcdiNj_M",
    libraries: ["places"],
  });

  if (!isLoaded) {
    return <h1>Map is not loaded</h1>;
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box
          style={{
            width: "100%",
            height: "100vh",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <GoogleMap
            center={center}
            clickableIcons={false}
            zoom={15}
            options={{
              zoomControl: true,
              streetViewControl: false,
              maxZoom: 15,
            }}
            mapContainerStyle={{
              width: "100%",
              height: "100vh",
            }}
            onClick={(e) =>
              createMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() })
            }
            onLoad={(map) => setMap(map)}
          >
            {marker != null ? <Marker position={marker} /> : null}
            {cuerrentDayEventsLocation &&
            cuerrentDayEventsLocation.length > 0 ? (
              <MarkerClusterer onLoad={() => console.log("cluster loaded")}>
                {(clusterer) =>
                  cuerrentDayEventsLocation.map((infoEvent) => (
                    <Marker
                      key={createKey(infoEvent.coors)}
                      position={infoEvent.coors}
                      clusterer={clusterer}
                      icon={clusterImg}
                      onClick={() => handleInfoWindow(infoEvent)}
                    />
                  ))
                }
              </MarkerClusterer>
            ) : null}
            {showInfoWindow ? (
              <InfoWindow
                onLoad={() => console.log("cluster loaded")}
                onCloseClick={() => handleCloseInfoWindow()}
                position={infoWindowData.coors}
              >
                <Box sx={{ minWidth: 275 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {infoWindowData.description}
                      </Typography>
                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {infoWindowData.event_date}
                      </Typography>
                      <Typography variant="body2">
                        {infoWindowData.details}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </InfoWindow>
            ) : null}
          </GoogleMap>
        </Box>
      </Grid>
      <Container sx={{ zIndex: "modal", marginTop: 4 }}>
        <Stack direction="row" justifyContent="center">
          <Grid item xs={12} md={4}>
            <Paper
              sx={{ backgroundColor: "white", borderRadius: 2, padding: 2 }}
              elevation={8}
            >
              <Typography variant="h5" gutterBottom component="div">
                ¿Dondé ocurrió el incidente? <span>😥</span>
              </Typography>
              <TextField
                label="Ubicacion"
                value={locationText}
                sx={{ width: "100%" }}
                onChange={handleLocationTextChange}
              />
              <Button onClick={() => handleSearchLocation()}>
                Ir a la ubicación...
              </Button>
              <Button onClick={() => resetLocation()}>Cancelar</Button>
              <Typography variant="overline" display="block" gutterBottom>
                Mostrando eventos del dia
              </Typography>
            </Paper>
          </Grid>
        </Stack>
      </Container>
      {marker ? (
        <Container>
          <Stack
            sx={{
              zIndex: "modal",
              position: "absolute",
              bottom: 0,
              right: 0,
            }}
          >
            <Grid item xs={12} md={12}>
              <Paper sx={{ padding: 8 }}>
                <Typography variant="h6">Detalles del evento:</Typography>

                <TextField
                  select
                  label="Tipo de crimen"
                  value={crimeType}
                  onChange={(e) => dispatch(setSelectedCrime(e.target.value))}
                  sx={{ width: "100%", marginBottom: 2 }}
                >
                  {crimeTypes &&
                    crimeTypes.map((crime) => (
                      <MenuItem key={crime.id} value={crime.id}>
                        {crime.description}
                      </MenuItem>
                    ))}
                </TextField>

                <TextField
                  label="Detalles"
                  value={crimeDetails}
                  sx={{ width: "100%" }}
                  multiline
                  onChange={(e) => dispatch(setCrimeDetails(e.target.value))}
                />
                <Typography variant="overline" display="block">
                  Coordenadas: {marker.lat}, {marker.lng}
                </Typography>
                <Typography variant="overline" display="block">
                  Ubicación: {locationText ? locationText : "No especificado"}
                </Typography>
                <Button onClick={() => handleSaveAlert()}>
                  Generar Alerta
                </Button>
              </Paper>
            </Grid>
          </Stack>
        </Container>
      ) : null}
    </Grid>
  );
};

//
