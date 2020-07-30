import React, { useState, useEffect, Fragment } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { listLogEntries } from "./API";
import "./App.css";
import LogEntryForm from "./LogEntryForm";

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 37.6,
    longitude: -95.665,
    zoom: 4,
  });

  useEffect(() => {
    getLogEntries();
  }, []);

  const getLogEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  const onClose = () => {
    setAddEntryLocation(null);
    getLogEntries();
  };

  const showMarkerPopup = (event) => {
    console.log(event.lngLat);
    const [longitude, latitude] = event.lngLat;
    setAddEntryLocation({ latitude, longitude });
  };

  const onCloseAll = () => {
    setShowPopup({});
    setAddEntryLocation(null);
  };

  return (
    <Fragment>
      <ReactMapGL
        {...viewport}
        mapStyle="mapbox://styles/thecjreynolds/ck117fnjy0ff61cnsclwimyay"
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        onDblClick={showMarkerPopup}
        onClick={() => onCloseAll()}
      >
        {logEntries.map((entry, key) => (
          <Fragment key={key}>
            <Marker latitude={entry.latitude} longitude={entry.longitude}>
              <div onClick={() => setShowPopup({ [entry._id]: true })}>
                <svg
                  className="marker yellow"
                  viewBox="0 0 24 24"
                  style={{
                    height: `${6 * viewport.zoom}px`,
                    width: `${6 * viewport.zoom}px`,
                  }}
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
            </Marker>
            {showPopup[entry._id] ? (
              <Popup
                latitude={entry.latitude}
                longitude={entry.longitude}
                closeButton={true}
                dynamicPosition={true}
                closeOnClick={false}
                onClose={() => setShowPopup({ [entry._id]: false })}
                anchor="top"
              >
                <div className="popup">
                  <h3>{entry.title}</h3>
                  <p>{entry.comments}</p>
                  <small>
                    Visited on: {new Date(entry.visitDate).toLocaleDateString()}
                  </small>
                  {entry.image && <img src={entry.image} alt={entry.title} />}
                </div>
              </Popup>
            ) : null}
          </Fragment>
        ))}
        {addEntryLocation ? (
          <>
            <Marker
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}
            >
              <div>
                <svg
                  className="marker red"
                  viewBox="0 0 24 24"
                  style={{
                    height: `${6 * viewport.zoom}px`,
                    width: `${6 * viewport.zoom}px`,
                  }}
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
            </Marker>
            <Popup
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}
              closeButton={true}
              dynamicPosition={true}
              closeOnClick={false}
              onClose={() => setAddEntryLocation(null)}
              anchor="top"
            >
              <div className="popup">
                <LogEntryForm
                  location={addEntryLocation}
                  onClose={() => onClose()}
                ></LogEntryForm>
              </div>
            </Popup>{" "}
          </>
        ) : null}
      </ReactMapGL>
    </Fragment>
  );
};

export default App;
