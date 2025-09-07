import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Quiz.css';
import './Analytics.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// ✅ Use environment variable, fallback to Render API
const API_BASE = process.env.REACT_APP_API_BASE || 'https://skill-map-mh.onrender.com/api';

const Analytics = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [nearbyColleges, setNearbyColleges] = useState([]);
  const [mapError, setMapError] = useState(null);
  const [mapRenderReady, setMapRenderReady] = useState(false);
  const [locationStatus, setLocationStatus] = useState('unknown');

  // Fetch ML prediction
  useEffect(() => {
    const answers = location.state?.answers;
    if (!answers) {
      setError('No quiz answers provided. Please complete the quiz first.');
      setLoading(false);
      return;
    }

    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE}/ml/predict-career`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ answers })
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to fetch analytics');
        }

        setResult(data.prediction);
      } catch (e) {
        setError(e.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, token]);

  // Request location + fetch colleges
  const requestLocation = async () => {
    const getPosition = () =>
      new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported'));
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          (err) => reject(err),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
      });

    const fetchOverpass = async (lat, lng) => {
      const radiusMeters = 10000;
      const query = `
        [out:json];
        (
          node["amenity"="college"](around:${radiusMeters},${lat},${lng});
          node["amenity"="university"](around:${radiusMeters},${lat},${lng});
          way["amenity"="college"](around:${radiusMeters},${lat},${lng});
          way["amenity"="university"](around:${radiusMeters},${lat},${lng});
          relation["amenity"="college"](around:${radiusMeters},${lat},${lng});
          relation["amenity"="university"](around:${radiusMeters},${lat},${lng});
        );
        out center;
      `;

      const endpoints = [
        'https://overpass-api.de/api/interpreter',
        'https://overpass.kumi.systems/api/interpreter',
        'https://overpass.openstreetmap.ru/api/interpreter'
      ];

      let data = null;
      for (const url of endpoints) {
        try {
          const resp = await fetch(`${url}?data=${encodeURIComponent(query)}`);
          if (resp.ok) {
            data = await resp.json();
            break;
          }
        } catch (_) {}
      }
      if (!data) throw new Error('Could not fetch nearby colleges');

      return (data.elements || [])
        .map((el) => {
          const center = el.center || (el.lat && el.lon ? { lat: el.lat, lon: el.lon } : null);
          return {
            id: el.id,
            name: el.tags?.name || 'Unnamed',
            type: el.tags?.amenity || 'college',
            lat: center?.lat,
            lng: center?.lon,
            website: el.tags?.website || el.tags?.url,
            address: [el.tags?.['addr:housenumber'], el.tags?.['addr:street'], el.tags?.['addr:city']]
              .filter(Boolean)
              .join(', ')
          };
        })
        .filter((p) => p.lat && p.lng);
    };

    try {
      setLocationStatus('prompt');
      const pos = await getPosition();
      setLocationStatus('granted');
      setUserPosition(pos);
      const colleges = await fetchOverpass(pos.lat, pos.lng);
      setNearbyColleges(colleges);
      setMapError(null);
    } catch (e) {
      console.error('Geolocation error:', e);
      setLocationStatus('denied');
      setMapError('Location access denied or unavailable.');
    }
  };

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        if (navigator.permissions && navigator.permissions.query) {
          const res = await navigator.permissions.query({ name: 'geolocation' });
          if (cancelled) return;
          setLocationStatus(res.state);
          if (res.state !== 'denied') requestLocation();
          res.onchange = () => setLocationStatus(res.state);
        } else {
          requestLocation();
        }
      } catch {
        requestLocation();
      }
    };
    check();
    return () => {
      cancelled = true;
    };
  }, []);

  const mapCenter = useMemo(() => {
    if (userPosition) return [userPosition.lat, userPosition.lng];
    return [19.7515, 75.7139]; // Default: Maharashtra
  }, [userPosition]);

  useEffect(() => {
    const t = setTimeout(() => setMapRenderReady(true), 0);
    return () => clearTimeout(t);
  }, []);

  const NearbyMap = React.memo(function NearbyMap({ center, userPosition, colleges }) {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const markersLayerRef = useRef(null);

    useEffect(() => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: markerIcon2x,
        iconUrl: markerIcon,
        shadowUrl: markerShadow
      });
    }, []);

    useEffect(() => {
      if (!containerRef.current || mapRef.current) return;
      const map = L.map(containerRef.current, { center, zoom: 12 });
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      return () => {
        try {
          map.remove();
        } catch (_) {}
        mapRef.current = null;
        markersLayerRef.current = null;
      };
    }, [center]);

    useEffect(() => {
      const map = mapRef.current;
      const layer = markersLayerRef.current;
      if (!map || !layer) return;
      layer.clearLayers();

      if (userPosition) {
        L.marker([userPosition.lat, userPosition.lng]).bindPopup('You are here').addTo(layer);
      }

      (colleges || []).forEach((c) => {
        const m = L.marker([c.lat, c.lng]);
        m.bindPopup(`<b>${c.name}</b><br/>${c.address || ''}`);
        m.addTo(layer);
      });
    }, [userPosition, colleges]);

    return <div style={{ height: '100%', width: '100%' }} ref={containerRef} />;
  });

  const goBack = () => navigate('/quiz');
  const goHome = () => navigate('/home');

  return (
    <div className="quiz-results-container analytics-container">
      <div className="results-header">
        <h1>Detailed Analytics</h1>
        <p>Insights powered by our ML model</p>
      </div>

      {loading && <p>Loading analytics...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && result && (
        <div>
          <h2>Predicted Course: {result.predicted_course}</h2>
          <p>Confidence: {Math.round((result.confidence || 0) * 100)}%</p>
        </div>
      )}

      <div className="results-section">
        <h2>Nearby Colleges</h2>
        <div style={{ height: 400, width: '100%' }}>
          {mapRenderReady && <NearbyMap center={mapCenter} userPosition={userPosition} colleges={nearbyColleges} />}
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={goBack}>← Back</button>
        <button onClick={goHome}>Go Home</button>
      </div>
    </div>
  );
};

export default Analytics;
