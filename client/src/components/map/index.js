import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
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
} from "@mui/material";

import {
  setCenter,
  setMarker,
  setInputLocation,
  setCrimeDetails,
  setCrimeType,
  setSelectedCrime,
  fetchCrimeTypesAsyn,
} from "./../../store/features/mapState";

export const Map = () => {
  const [map, setMap] = useState(null);
  const center = useSelector((state) => state.mapState.center);
  const marker = useSelector((state) => state.mapState.marker);
  const locationText = useSelector((state) => state.mapState.inputLocation);
  const crimeDetails = useSelector((state) => state.mapState.crimeDetails);
  const crimeType = useSelector((state) => state.mapState.crimeType);
  const crimeTypes = useSelector((state) => state.mapState.crimeTypes);

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
    dispatch(setCrimeType(1));
  };

  const handleLocationNotFound = () => {
    dispatch(setInputLocation(""));
    dispatch(setMarker(null));
    alert("Ubicacion no encontrada");
  };

  const handleLocationTextChange = (e) => {
    dispatch(setInputLocation(e.target.value));
  };

  useEffect(() => {
    dispatch(fetchCrimeTypesAsyn());
  }, []);

  useEffect(() => {
    setMarker(center);
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords.latitude);
      console.log(position.coords.longitude);
    });
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
              zoomControl: false,
              streetViewControl: false,
              maxZoom: 15,
              minZoom: 15,
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
          </GoogleMap>
        </Box>
      </Grid>
      <Container sx={{ zIndex: "modal", marginTop: 4 }}>
        <Stack direction="row" justifyContent="center">
          <Grid item xs={4}>
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
              <Button onClick={() => resetLocation()}>Borrar</Button>
            </Paper>
          </Grid>
        </Stack>
      </Container>
      {marker ? (
        <Container
          sx={{ zIndex: "modal", position: "absolute", bottom: 0, right: 0 }}
        >
          <Stack direction="row" justifyContent="right">
            <Grid item xs={8}>
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
                <Button onClick={() => console.log("Alerta generada")}>
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
