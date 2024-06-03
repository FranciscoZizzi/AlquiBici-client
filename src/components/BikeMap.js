import React from 'react';
import {Map, MapLayers, MapMarkerLayer, MapTileLayer} from "@progress/kendo-react-map";
import '@progress/kendo-theme-default/dist/all.css';

const BikeMap = ({data}) => {
    const tileUrl = (e) => `https://tile.openstreetmap.org/${e.zoom}/${e.x}/${e.y}.png`;
    const attribution = '© OpenStreetMap contributors';

    return (
        <Map center={[-34.603722, -58.381592]} zoom={10}>
            <MapLayers>
                <MapTileLayer
                    urlTemplate={tileUrl}
                    attribution={attribution}
                />
                <MapMarkerLayer
                    data={data}
                    locationField="coords"
                    titleField="name"
                />
            </MapLayers>
        </Map>
    );
}

export default BikeMap;