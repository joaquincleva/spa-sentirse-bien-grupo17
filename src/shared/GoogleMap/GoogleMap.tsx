import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const MapComponent = () => {
  const mapStyles = {
    height: "450px",
    width: "91.5%",
    borderRadius: "25px",
    border: "3px lightgray solid"
  };

  const defaultCenter = {
    lat: -27.4511697,
    lng: -58.9866303,
  };

  return (
    <LoadScript
      googleMapsApiKey={process?.env?.NEXT_PUBLIC_GOOGLE_API_KEY ?? ""}
    >
      <GoogleMap mapContainerStyle={mapStyles} zoom={17} center={defaultCenter}>
        <Marker label={"Spa Sentirse bien"} position={defaultCenter} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
