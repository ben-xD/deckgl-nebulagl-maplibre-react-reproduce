import { useEffect, useRef, useState } from "react";
// /maplibre vs none? what library is the map instance?
import Map from 'react-map-gl/maplibre';
// import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import {default as EditableGeoJsonLayer, EditableGeojsonLayerProps} from '@nebula.gl/layers/src/layers/editable-geojson-layer';
import { MapboxOverlay } from "@deck.gl/mapbox/typed";
import { GeoJsonLayer } from "@deck.gl/layers/typed";
import DeckGL, { DeckGLRef } from "@deck.gl/react/typed";
import type { FeatureCollection } from "geojson";
import {RotateMode, TranslateMode, ViewMode} from "@nebula.gl/edit-modes";
import { circleOverIreland, polygonOverEngland } from "./features";
import { polygonOverScotlandCollection } from "./featureCollections";
import {Layer} from "@deck.gl/core/typed";

// When using the @deck.gl/mapbox module, and MapboxLayer and MapboxOverlay https://deck.gl/docs/api-reference/mapbox/overview
// Mapbox is the root element and deck.gl is the child, with Mapbox handling all user inputs
// it is recommended that you use deck.gl as the root element, so we are doing the opposite.

// To debug deck.gl, run the following in the browser console, as per https://deck.gl/docs/developer-guide/debugging.
// However, it makes the shapes dissapear and an error (`luma.gl: assertion failed.`)
// deck.log.enable();
// deck.log.level = 3; // or 1 or 2

const initialViewState = {
  longitude: -0.08648816636906795,
  latitude: 51.519898434555685,
  zoom: 5
};

function App() {
  const dragPan = false;
  const deckGlRef = useRef<DeckGLRef>(null);
  console.log("render");
  // const [getMode, setMode] = useState(() => DrawPolygonMode);
  const [selectedFeatureIndexes, setSelectedFeatureIndexes] = useState<
    number[]
  >([]);
  const [featureCollection, setFeatureCollection] = useState<FeatureCollection>(
    {
      type: "FeatureCollection",
      features: [circleOverIreland, polygonOverEngland],
    }
  );

  const geojsonLayer = new GeoJsonLayer({
    opacity: 0.1,
    data: polygonOverScotlandCollection,
    id: "geojson-layer-ben",
    getFillColor: [255, 0, 0],
    pickable: true,
    mode: ViewMode,
    onClick: (pickInfo, hammerInput) => {
      console.log("click", { pickInfo, hammerInput, featureCollection });
    },
  });

  const getMode = () => {
    if (featureCollection?.features.length >= 1) {
      console.log(`feature count: ${featureCollection?.features.length}`)
      return RotateMode;
    }
    return ViewMode;
  }

  // TYPEERROR 3: EditableGeoJsonLayer constructor Expected 0 arguments, but got 1.
  const editableGeojsonLayer = new EditableGeoJsonLayer({
    opacity: 0.1,
    id: "editable-geojson-layer-ben",
    data: featureCollection,
    getFillColor: [0, 255, 0],
    pickable: true,
    selectedFeatureIndexes: selectedFeatureIndexes,
    // Doesn't work with RotateMode. Though it will work briefly (when hot reloading to RotateMode from TranslateMode)
    mode: RotateMode,
    onClick: (pickInfo, hammerInput) => {
      console.log("click", { pickInfo, hammerInput, featureCollection });
      setSelectedFeatureIndexes([pickInfo.index]);
    },
    // types say it takes a function with 4 args, but actually it gets a single object argument, with 4 properties
    // onEdit: (
    //   updatedData: any | undefined,
    //   editType: string | undefined,
    //   featureIndexes: number[] | undefined,
    //   editContext: any | undefined
    //   // updatedData: FeatureCollection,
    //   // editType: string,
    //   // featureIndexes: number[],
    //   // editContext: any | null
    // ) => {

    onEdit: ({
               updatedData,
               editType,
               featureIndexes,
               editContext
             }) => {
      console.log(`onEdit`);
      if (updatedData && updatedData.features) {
        console.log("onEdit called with features", {
          updatedData,
          editType,
          featureIndexes,
          editContext,
        });
        setFeatureCollection(updatedData);
      } else {
        console.error("onEdit called with no features", {
          updatedData,
          editType,
          featureIndexes,
          editContext,
        });
      }
    },
  });

  const mapRef = useRef<Map>();
    // {/*"https://api.maptiler.com/maps/outdoor-v2/style.json?key=LlETYKEJwgxoM6pCNChm",*/}
  return <DeckGL ref={deckGlRef} initialViewState={initialViewState} layers={[editableGeojsonLayer, geojsonLayer]}>
    <Map
      ref={mapRef}
      initialViewState={initialViewState}
      style={{width: 600, height: 400}}
      dragPan={dragPan}
      mapStyle="https://demotiles.maplibre.org/style.json"
    />
  </DeckGL>;
}

export default App;
