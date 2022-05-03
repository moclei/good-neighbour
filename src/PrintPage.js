import React from 'react';
import {LoadScript} from "@react-google-maps/api";
import Map from "./Map";
import './App.css';

export const PrintPage = React.forwardRef((props, ref) => {

    return (
        <div ref={ref} className="Map-container">
            <LoadScript googleMapsApiKey={props.apiKey} libraries={props.libraries}>
                <Map
                    mapPosition={props.mapPos}
                    renderMarkers={props.renderMarkers}
                />
            </LoadScript>
        </div>
    );
});
