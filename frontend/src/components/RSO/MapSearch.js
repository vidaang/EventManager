import React, { useState, useEffect } from 'react';
import {
    APIProvider,
    Map,
    AdvancedMarker,
    MapCameraChangedEvent,
    Pin
  } from '@vis.gl/react-google-maps';
import '../../styles/index.css';

const baseUrl = "http://localhost:5000";

type Poi = { key: string; location: google.maps.LatLngLiteral };

const locations: Poi[] = [
  {key: 'su', location: { lat: 28.601956, lng: -81.200512  }},
  {key: 'lib', location: { lat: 28.600551, lng: -81.201251 }},
  {key: 'sciences', location: { lat: 28.600991, lng: -81.200120 }},
  {key: 'ba1', location: { lat: 28.601018, lng: -81.199138 }},
  {key: 'ba2', location: { lat: 28.600806, lng: -81.198682 }},
  {key: 'eng1', location: { lat: 28.601536, lng: -81.198290 }},
  {key: 'eng2', location: { lat: 28.601823, lng: -81.198466 }},
  {key: 'hs1', location: { lat: 28.603016, lng: -81.198656 }},
  {key: 'hs2', location: { lat: 28.603181, lng: -81.198161 }},
  {key: 'global', location: { lat: 28.604644, lng: -81.197940 }},
  {key: 'cb1', location: { lat: 28.603720, lng: -81.200447 }},
  {key: 'cb2', location: { lat: 28.604219, lng: -81.200018 }},
  {key: 'psy', location: { lat: 28.604820, lng: -81.199829 }},
  {key: 'arena', location: { lat: 28.607334, lng: -81.197283 }},
  {key: 'nsc', location: { lat: 28.603960, lng: -81.202879 }},
  {key: 'vab', location: { lat: 28.602809, lng: -81.203054 }},
  {key: 'bhc', location: { lat: 28.602204, lng: -81.202299 }},
  {key: 'tch', location: { lat: 28.601803, lng: -81.203287 }},
  {key: 'hph', location: { lat: 28.600255, lng: -81.202716 }},
  {key: 'millican', location: { lat: 28.599087, lng: -81.202301 }},
  {key: 'teachAca', location: { lat: 28.599256, lng: -81.204119 }},
  {key: 'rwc', location: { lat: 28.595499, lng: -81.199418 }},
  {key: 'imFields', location: { lat: 28.591216, lng: -81.202890 }},
  {key: 'lakeClaire', location: { lat: 28.607125, lng: -81.203275 }},
];

const MapSearch = () => {
    const initialLatLng = { lat: 28.602333068847656, lng: -81.20020294189453 };
    const [selectedLocation, setSelectedLocation] = useState(initialLatLng);
    const [formData, setFormData] = useState({
        location: '',
        eventName: '',
        description: '',
        eventType: 'social',
        date: '',
        time: '',
        contactPhone: '',
        contactEmail: '',
        visibility: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    useEffect(() => {
        setFormData((prevData) => ({ ...prevData, location: `${selectedLocation.lat}, ${selectedLocation.lng}` }));
    }, [selectedLocation]);

    const handleMapClick = (e) => {
        const newLatLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setSelectedLocation(newLatLng);
        setIsModalOpen(true);
    };

    const handleMarkerClick = (poi: Poi) => {
        console.log("Marker clicked:", poi);
        setSelectedLocation(poi.location);
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const saveChanges = async () => {
        try {
            const response = await fetch(`${baseUrl}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!response.ok) throw new Error('Failed to save event');
            console.log('Event saved successfully');
        } catch (error) {
            console.error(error);
        }
        closeModal();
    };

    return (
        <div>
            <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                <div id="MapView">
                    <Map
                        className="map-container"
                        defaultCenter={initialLatLng}
                        defaultZoom={16.2}
                        fullscreenControl={false}
                        streetViewControl={false}
                        mapId="415478165339729e"
                        onClick={handleMapClick}
                    >
                        <PoiMarkers pois={locations} onMarkerClick={handleMarkerClick} />
                    </Map>
                </div>
            </APIProvider>
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close-btn" onClick={closeModal}>&times;</button>
                        <h2 className="modal-title">Create Event</h2>
                        <label>
                            Location (Auto-filled):
                            <input type="text" name="location" value={formData.location} readOnly />
                        </label>
                        <label>
                            Event Name:
                            <input type="text" name="eventName" value={formData.eventName} onChange={handleInputChange} />
                        </label>
                        <label>
                            Description:
                            <input type="text" name="description" value={formData.description} onChange={handleInputChange} />
                        </label>
                        <label>
                            Event Type:
                            <select name="eventType" value={formData.eventType} onChange={handleInputChange}>
                                <option value="social">Social</option>
                                <option value="fundraising">Fundraising</option>
                                <option value="tech talk">Tech Talk</option>
                                <option value="other">Other</option>
                            </select>
                        </label>
                        <label>
                            Date:
                            <input type="date" name="date" value={formData.date} onChange={handleInputChange} />
                        </label>
                        <label>
                            Time:
                            <input type="time" name="time" value={formData.time} onChange={handleInputChange} />
                        </label>
                        <label>
                            Contact Phone:
                            <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} />
                        </label>
                        <label>
                            Contact Email:
                            <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} />
                        </label>
                        <label>
                            Visibility:
                            <select name="visibility" value={formData.visibility} onChange={handleInputChange}>
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                                <option value="rso">RSO</option>
                            </select>
                        </label>
                        <div className="modal-buttons">
                            <button className="save-btn" onClick={saveChanges}>Save</button>
                            <button className="cancel-btn" onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const PoiMarkers = (props: { pois: Poi[], onMarkerClick: (poi: Poi) => void }) => {
    return (
        <>
            {props.pois.map((poi: Poi) => (
                <AdvancedMarker
                    key={poi.key}
                    position={poi.location}
                    onClick={() => props.onMarkerClick(poi)}
                >
                    <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
                </AdvancedMarker>
            ))}
        </>
    );
};

export default MapSearch;
