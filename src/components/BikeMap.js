import React from 'react';
import {Map, MapLayers, MapMarkerLayer, MapTileLayer} from "@progress/kendo-react-map";

const BikeMap = ({data}) => {
    const tileUrl = (e) => `https://tile.openstreetmap.org/${e.zoom}/${e.x}/${e.y}.png`;
    const attribution = '© OpenStreetMap contributors';

    return (
        <Map>
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