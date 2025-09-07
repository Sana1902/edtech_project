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

// Leaflet removed; using MapLibre for map rendering

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
  const [locationStatus, setLocationStatus] = useState('unknown'); // 'granted' | 'denied' | 'prompt' | 'unknown'

  // No-op retained for compatibility; not used with MapLibre
 
const API_BASE = process.env.REACT_APP_API_URL || 'https://skill-map-mh.onrender.com/api';

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
  }, [location.state, token]);

  // Request location and fetch nearby colleges via Overpass API
  const requestLocation = async () => {
    const getPosition = () => new Promise((resolve, reject) => {
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
      // Query colleges/universities within ~10km radius
      const radiusMeters = 10000;
      const query = `[
        out:json
      ];
      (
        node["amenity"="college"](around:${radiusMeters},${lat},${lng});
        node["amenity"="university"](around:${radiusMeters},${lat},${lng});
        way["amenity"="college"](around:${radiusMeters},${lat},${lng});
        way["amenity"="university"](around:${radiusMeters},${lat},${lng});
        relation["amenity"="college"](around:${radiusMeters},${lat},${lng});
        relation["amenity"="university"](around:${radiusMeters},${lat},${lng});
      );
      out center;`;

      const endpoints = [
        'https://overpass-api.de/api/interpreter',
        'https://overpass.kumi.systems/api/interpreter',
        'https://overpass.openstreetmap.ru/api/interpreter'
      ];

      let data = null;
      // Try GET with encoded query first (more CORS-friendly), then POST fallback
      for (const url of endpoints) {
        try {
          const resp = await fetch(`${url}?data=${encodeURIComponent(query)}`, { headers: { 'Accept': 'application/json' } });
          if (resp.ok) {
            data = await resp.json();
            break;
          }
        } catch (_) {}
      }
      if (!data) {
        for (const url of endpoints) {
          try {
            const resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain', 'Accept': 'application/json' }, body: query });
            if (resp.ok) {
              data = await resp.json();
              break;
            }
          } catch (_) {}
        }
      }
      if (!data) throw new Error('Could not fetch nearby colleges');

      return (data.elements || []).map(el => {
        const center = el.center || (el.lat && el.lon ? { lat: el.lat, lon: el.lon } : null);
        return {
          id: el.id,
          name: el.tags?.name || 'Unnamed',
          type: el.tags?.amenity || 'college',
          lat: center?.lat,
          lng: center?.lon,
          website: el.tags?.website || el.tags?.url,
          address: [el.tags?.['addr:housenumber'], el.tags?.['addr:street'], el.tags?.['addr:city']].filter(Boolean).join(', ')
        };
      }).filter(p => p.lat && p.lng);
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
      setMapError('Location access denied or unavailable. Using default center.');
    }
  };

  // On mount: check permission and request if possible
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        if (navigator.permissions && navigator.permissions.query) {
          const res = await navigator.permissions.query({ name: 'geolocation' });
          if (cancelled) return;
          setLocationStatus(res.state);
          if (res.state !== 'denied') {
            // Will trigger browser prompt if 'prompt'
            requestLocation();
          }
          res.onchange = () => setLocationStatus(res.state);
        } else {
          // Fallback: try to request, browser will prompt
          requestLocation();
        }
      } catch (_) {
        requestLocation();
      }
    };
    check();
    return () => { cancelled = true; };
  }, []);

  const mapCenter = useMemo(() => {
    if (userPosition) return [userPosition.lat, userPosition.lng];
    // Fallback center: Maharashtra (approx)
    return [19.7515, 75.7139];
  }, [userPosition]);

  useEffect(() => {
    // Defer map render to post-mount to avoid StrictMode double-mount glitches
    const t = setTimeout(() => setMapRenderReady(true), 0);
    return () => clearTimeout(t);
  }, []);

  const NearbyMap = React.memo(function NearbyMap({ center, userPosition, colleges }) {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const markersLayerRef = useRef(null);

    // Fix Leaflet default marker icon URLs for CRA bundling
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
      const map = L.map(containerRef.current, {
        center: center,
        zoom: 12,
        zoomControl: true,
        preferCanvas: true
      });
      mapRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors, &copy; <a href='https://carto.com/attributions'>CARTO</a>"
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);

      const onResize = () => {
        try { map.invalidateSize(false); } catch (_) {}
      };
      window.addEventListener('resize', onResize);
      return () => {
        window.removeEventListener('resize', onResize);
        try { map.remove(); } catch (_) {}
        mapRef.current = null;
        markersLayerRef.current = null;
      };
    }, [center]);

    // Recenter when center changes
    useEffect(() => {
      const map = mapRef.current;
      if (!map) return;
      map.setView(center, 12, { animate: false });
    }, [center]);

    // Update markers when userPosition/colleges change
    useEffect(() => {
      const map = mapRef.current;
      const layer = markersLayerRef.current;
      if (!map || !layer) return;
      layer.clearLayers();

      const bounds = L.latLngBounds([]);

      if (userPosition) {
        const userMarker = L.marker([userPosition.lat, userPosition.lng]);
        userMarker.bindPopup('You are here');
        userMarker.addTo(layer);
        bounds.extend([userPosition.lat, userPosition.lng]);
      }

      (colleges || []).forEach((c) => {
        const m = L.marker([c.lat, c.lng]);
        const html = `<div style="min-width:180px">
          <div style="font-weight:700;margin-bottom:4px">${c.name || 'Unnamed'}</div>
          <div style="opacity:.9;margin-bottom:6px">${c.address || 'Address unavailable'}</div>
          ${c.website ? `<a href="${c.website}" target="_blank" rel="noreferrer">Website</a>` : ''}
        </div>`;
        m.bindPopup(html);
        m.addTo(layer);
        bounds.extend([c.lat, c.lng]);
      });

      if (bounds.isValid()) {
        setTimeout(() => {
          try { map.fitBounds(bounds.pad(0.2), { animate: false }); } catch (_) {}
        }, 50);
      }
    }, [userPosition, colleges]);

    return (
      <div style={{ height: '100%', width: '100%' }} ref={containerRef} />
    );
  });

  const goBack = () => navigate('/quiz');
  const goHome = () => navigate('/home');

  return (
    <div className="quiz-results-container analytics-container">
      <div className="results-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <div className="results-content">
        <div className="results-header">
          <h1>Detailed Analytics</h1>
          <p>Personalized insights powered by the ML model</p>
        </div>

        {locationStatus !== 'granted' && (
          <div className="career-card" style={{ padding: '12px', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <span>
                {locationStatus === 'denied' ? 'Location is blocked. Please allow location in your browser settings to see nearby colleges.' : 'Allow location to show colleges near you.'}
              </span>
              <button className="btn btn-accent" onClick={requestLocation}>Enable Location</button>
            </div>
          </div>
        )}

        {loading && (
          <div className="career-card" style={{ padding: '16px' }}>Loading analytics...</div>
        )}

        {error && (
          <div className="career-card" style={{ padding: '16px', color: '#ff6b6b' }}>{error}</div>
        )}

        {!loading && !error && result && (
          <>
            <div className="results-stats">
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <h3>{result.predicted_course || '—'}</h3>
                <p>Predicted Course</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔒</div>
                <h3>{Math.round((result.confidence || 0) * 100)}%</h3>
                <p>Confidence</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <h3>{(result.topFeatures || []).length}</h3>
                <p>Top Features Considered</p>
              </div>
            </div>

            <div className="results-section">
              <h2>Top Features</h2>
              <div className="category-results">
                {(result.topFeatures || []).map(([feature, score], idx) => (
                  <div key={`${feature}-${idx}`} className="category-card">
                    <div className="category-rank">
                      <span className="rank-badge">#{idx + 1}</span>
                      <span className="category-icon">⭐</span>
                    </div>
                    <h3>{feature}</h3>
                    <div className="score-container">
                      <div className="score-bar">
                        <div className="score-fill" style={{ width: `${Math.min(100, (score / 5) * 100)}%` }}></div>
                      </div>
                      <span className="score-value">{score}/5</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="results-section">
              <h2>Recommended Courses</h2>
              <div className="career-recommendations">
                {(() => {
                  const topCourses = (result.recommendedCourses || [])
                    .flatMap((rec) => (rec.courses || []).map((course) => ({ course, rec })))
                    .slice(0, 2);
                  return topCourses.map(({ course, rec }, idx) => (
                    <div key={`topcourse-${idx}`} className="career-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                      <h3>{course.course}</h3>
                      <div style={{ marginBottom: 8, opacity: 0.9 }}>Suggested from: {rec.feature} (score: {rec.score})</div>
                      <ul>
                        <li>
                          {course.overview && (
                            <div style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: '6px' }}>
                              <strong>Overview:</strong> {course.overview}
                            </div>
                          )}
                          {course.eligibility && (
                            <div style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: '6px' }}>
                              <strong>Eligibility:</strong> {course.eligibility.stream}{course.eligibility.exams ? ` • Exams: ${course.eligibility.exams}` : ''}
                            </div>
                          )}
                          {course.salary_range && (
                            <div style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: '6px' }}>
                              <strong>Salary Range:</strong> {course.salary_range}
                            </div>
                          )}
                          {Array.isArray(course.skills_required) && course.skills_required.length > 0 && (
                            <div style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: '6px' }}>
                              <strong>Skills Required:</strong> {course.skills_required.join(', ')}
                            </div>
                          )}
                          {course.job_opportunities && (
                            <div style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: '6px' }}>
                              <strong>Job Opportunities:</strong> {course.job_opportunities}
                            </div>
                          )}
                          {course.youtube_video_url && (
                            <div style={{ fontSize: '0.95rem', opacity: 0.9, marginBottom: '6px' }}>
                              <strong>Video Link:</strong> <a href={course.youtube_video_url} target="_blank" rel="noreferrer" style={{ color: '#6a00ff' }}>Watch</a>
                            </div>
                          )}
                          {Array.isArray(course.colleges_in_kolhapur) && course.colleges_in_kolhapur.length > 0 && (
                            <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>
                              <strong>Colleges in Kolhapur:</strong> {course.colleges_in_kolhapur.join(', ')}
                            </div>
                          )}
                        </li>
                      </ul>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {result.featureScores && (
              <div className="results-section">
                <h2>All Feature Scores</h2>
                <div className="career-card" style={{ padding: '16px', overflowX: 'auto' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    {Object.entries(result.featureScores).map(([feat, sc]) => (
                      <div key={feat} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px' }}>
                        <span>{feat}</span>
                        <span>{sc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Map Section - always visible */}
        <div className="results-section">
          <h2>Nearby Colleges Map</h2>
          {mapError && (
            <div className="career-card" style={{ padding: '12px', color: '#ff6b6b' }}>{mapError}</div>
          )}
          <div style={{ height: 420, width: '100%', position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
            {mapRenderReady && (
              <NearbyMap center={mapCenter} userPosition={userPosition} colleges={nearbyColleges} />
            )}
          </div>
          <div style={{ marginTop: 8, opacity: 0.85 }}>
            Showing {nearbyColleges.length} nearby colleges within ~10 km
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={goBack} className="btn btn-secondary">
            ← Back to Results
          </button>
          <button onClick={goHome} className="btn btn-primary">
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;


