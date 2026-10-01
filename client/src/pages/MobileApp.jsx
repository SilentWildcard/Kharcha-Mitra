import React, { useState, useEffect } from 'react';
import { Smartphone, Download, QrCode, CheckCircle, ShieldCheck, Zap, Globe, ArrowRight } from 'lucide-react';

const MobileApp = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [localIp, setLocalIp] = useState('192.168.1.39');

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert("To install on your phone:\n1. Open http://" + localIp + ":5173 in Chrome on your phone.\n2. Tap the ⋮ menu in the top right.\n3. Tap 'Install app' or 'Add to Home screen'.");
    }
  };

  const phoneUrl = `http://${localIp}:5173`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(phoneUrl)}`;

  return (
    <div className="mobile-app-page">
      <div className="page-header">
        <h1>Kharcha Mitra on Your Smartphone</h1>
        <p>Take your personal budget and group splits wherever you go</p>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
        {/* Method 1: Instant Smartphone Install */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'var(--accent-light)', padding: '12px', borderRadius: '12px', color: 'var(--accent)' }}>
                <Zap size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>1. Instant Smartphone App</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>⚡ Recommended • No File Download Required</span>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.5 }}>
              Install Kharcha Mitra directly onto your Android device as a standalone WebAPK. Works offline, has its own app icon, and opens in full screen without the browser bar.
            </p>

            <div style={{ background: 'var(--bg-card-hover)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Scan with your phone (same Wi-Fi):</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code" 
                  style={{ width: '110px', height: '110px', borderRadius: '8px', background: '#fff', padding: '4px' }} 
                />
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div>Or open this URL on your phone's browser:</div>
                  <div style={{ marginTop: '6px', fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 600, fontSize: '0.95rem' }}>
                    {phoneUrl}
                  </div>
                  <div style={{ marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Then tap ⋮ &rarr; "Install app" / "Add to Home screen"
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
            onClick={handleInstallClick}
          >
            <Smartphone size={18} />
            {isInstalled ? 'App Already Installed ✓' : 'Install on This Device Now'}
          </button>
        </div>

        {/* Method 2: Android APK Package */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(34, 197, 94, 0.15)', padding: '12px', borderRadius: '12px', color: 'var(--success)' }}>
                <Smartphone size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>2. Android APK Package</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Native Capacitor Android Build</span>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.5 }}>
              The project includes a complete native Android package (located in <code style={{ color: 'var(--accent)' }}>client/android/</code>) ready to build or share with anyone via direct <code>.apk</code> download.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <ShieldCheck size={18} color="var(--success)" />
                <span>Package ID: <strong>com.kharchamitra.app</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <CheckCircle size={18} color="var(--success)" />
                <span>Capacitor Native Bridge & Android Gradle Project Ready</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <Globe size={18} color="var(--success)" />
                <span>Automated GitHub Actions CI/CD Cloud Builder Configured</span>
              </div>
            </div>
          </div>

          <a 
            href="/api/download-apk" 
            download="KharchaMitra.apk"
            className="btn btn-secondary" 
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
          >
            <Download size={18} />
            Download APK File (.apk)
          </a>
        </div>
      </div>

      {/* Guide Steps */}
      <div className="card">
        <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>How to Share with Friends & Group Members</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'var(--bg-card-hover)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ color: 'var(--accent)', fontWeight: 700, marginBottom: '6px' }}>Step 1: Connect</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Make sure friends are connected to the same Wi-Fi or hotspot as your host machine.
            </p>
          </div>
          <div style={{ background: 'var(--bg-card-hover)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ color: 'var(--accent)', fontWeight: 700, marginBottom: '6px' }}>Step 2: Share Link / QR</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Send them the link <strong style={{ color: 'var(--text-primary)' }}>{phoneUrl}</strong> or let them scan the QR code above.
            </p>
          </div>
          <div style={{ background: 'var(--bg-card-hover)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ color: 'var(--accent)', fontWeight: 700, marginBottom: '6px' }}>Step 3: 1-Tap Install</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Their phone will prompt to "Install app", adding Kharcha Mitra to their home screen with the app icon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileApp;
