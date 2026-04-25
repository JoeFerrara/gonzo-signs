import React, { useRef, useEffect, useState } from 'react';
import type { Sign } from '../data/signs';

interface CanvasSimulatorProps {
  sign: Sign;
  isCorrectBehavior: boolean;
  triggerKey: number;
}

// Asset URLs
const ASSETS = {
  grass: 'https://images.unsplash.com/photo-1558102822-da571ebfa80a?q=80&w=400&auto=format&fit=crop',
  asphalt: 'https://images.unsplash.com/photo-1517581024317-10115b021307?q=80&w=400&auto=format&fit=crop',
  // Highly detailed SVG top-down car to serve as a reliable "sprite"
  mainCar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200"><rect width="100" height="200" rx="20" fill="%231d4ed8"/><rect x="10" y="40" width="80" height="60" rx="10" fill="%230f172a" opacity="0.8"/><rect x="15" y="120" width="70" height="40" rx="5" fill="%230f172a" opacity="0.8"/><rect x="10" y="10" width="20" height="10" fill="%23facc15"/><rect x="70" y="10" width="20" height="10" fill="%23facc15"/><rect x="10" y="180" width="20" height="10" fill="%23ef4444"/><rect x="70" y="180" width="20" height="10" fill="%23ef4444"/></svg>',
  threatCar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200"><rect width="100" height="200" rx="10" fill="%23b91c1c"/><rect x="10" y="30" width="80" height="50" rx="5" fill="%23000" opacity="0.9"/><rect x="15" y="110" width="70" height="50" rx="5" fill="%23000" opacity="0.9"/></svg>',
  policeCar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200"><rect width="100" height="200" rx="20" fill="%23ffffff"/><rect x="10" y="40" width="80" height="60" rx="10" fill="%230f172a"/><path d="M0 80 Q 50 120 100 80 L 100 180 Q 50 140 0 180 Z" fill="%23000000"/><rect x="30" y="80" width="40" height="10" fill="%23ef4444"/><rect x="30" y="90" width="40" height="10" fill="%233b82f6"/></svg>',
  pedestrian: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><circle cx="25" cy="25" r="15" fill="%23fca5a5"/><rect x="10" y="20" width="30" height="10" rx="5" fill="%23475569"/></svg>'
};

export const CanvasSimulator: React.FC<CanvasSimulatorProps> = ({ sign, isCorrectBehavior, triggerKey }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [outcome, setOutcome] = useState<string | null>(null);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const images = useRef<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    let loadedCount = 0;
    const totalAssets = Object.keys(ASSETS).length;
    
    // Fallback: forcefully proceed after 2 seconds even if some images fail
    const fallbackTimer = setTimeout(() => {
      setAssetsLoaded(true);
    }, 2000);

    Object.entries(ASSETS).forEach(([key, url]) => {
      const img = new Image();
      if (url.startsWith('http')) {
        img.crossOrigin = 'anonymous';
      }
      const handleLoad = () => {
        loadedCount++;
        if (loadedCount === totalAssets) {
          clearTimeout(fallbackTimer);
          setAssetsLoaded(true);
        }
      };
      img.onload = handleLoad;
      img.onerror = (err) => {
        console.error('Failed to load asset', key, err);
        handleLoad();
      };
      img.src = url;
      images.current[key] = img;
    });

    return () => clearTimeout(fallbackTimer);
  }, []);

  useEffect(() => {
    if (!assetsLoaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stopTimer: number | null = null;
    setOutcome(null);

    const roadWidth = 120;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    interface Entity {
      x: number; y: number; vx: number; vy: number;
      width: number; height: number;
      type: 'main' | 'threat' | 'police' | 'pedestrian';
      angle: number;
      flashing?: boolean;
    }

    let entities: Entity[] = [];
    let particles: {x: number, y: number, vx: number, vy: number, life: number, size: number, color: string}[] = [];

    const resetSimulation = () => {
      particles = [];
      stopTimer = null;
      
      const mainCar: Entity = {
        x: centerX + 20, y: canvas.height + 60, vx: 0, vy: -4,
        width: 30, height: 60, type: 'main', angle: 0
      };

      entities = [mainCar];

      if (sign.scenario === '4-way' || sign.scenario === 'T-junction') {
        if (!isCorrectBehavior) {
           entities.push({
             x: -60, y: centerY - 20, vx: 6, vy: 0,
             width: 60, height: 30, type: 'threat', angle: Math.PI / 2
           });
        }
      }

      if (sign.scenario === 'Crosswalk' || sign.name === 'Stop') {
         // Add pedestrian
         entities.push({
            x: centerX - 100, y: centerY - 40, vx: 1.5, vy: 0,
            width: 20, height: 20, type: 'pedestrian', angle: Math.PI / 2
         });
      }

      if (!isCorrectBehavior && (sign.name.includes('Speed') || sign.name.includes('Stop') || sign.name.includes('Yield'))) {
         entities.push({
           x: centerX + 20, y: canvas.height + 250, vx: 0, vy: -5,
           width: 30, height: 60, type: 'police', angle: 0
         });
      }
    };

    resetSimulation();

    const drawRoads = () => {
      // Grass pattern
      const grassImg = images.current.grass;
      if (grassImg && grassImg.complete && grassImg.naturalWidth > 0) {
        const ptrn = ctx.createPattern(grassImg, 'repeat');
        if (ptrn) {
          ctx.fillStyle = ptrn;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      } else {
        ctx.fillStyle = '#14532d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Asphalt
      const ashImg = images.current.asphalt;
      if (ashImg && ashImg.complete && ashImg.naturalWidth > 0) {
        const ashptrn = ctx.createPattern(ashImg, 'repeat');
        if (ashptrn) {
          ctx.fillStyle = ashptrn;
        } else {
          ctx.fillStyle = '#333';
        }
      } else {
        ctx.fillStyle = '#333';
      }

      if (sign.scenario === '4-way' || sign.scenario === 'T-junction' || sign.scenario === 'Crosswalk') {
        ctx.fillRect(centerX - roadWidth / 2, 0, roadWidth, canvas.height);
        ctx.fillRect(0, centerY - roadWidth / 2, canvas.width, roadWidth);
        
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 4;
        ctx.setLineDash([30, 20]);
        ctx.beginPath();
        ctx.moveTo(centerX, 0); ctx.lineTo(centerX, canvas.height);
        ctx.moveTo(0, centerY); ctx.lineTo(canvas.width, centerY);
        ctx.stroke();

        ctx.strokeStyle = '#fff';
        ctx.setLineDash([]);
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(centerX - roadWidth/2, centerY + roadWidth/2 + 20);
        ctx.lineTo(centerX + roadWidth/2, centerY + roadWidth/2 + 20);
        ctx.stroke();

        if (sign.scenario === 'Crosswalk') {
           ctx.lineWidth = 15;
           ctx.setLineDash([10, 15]);
           ctx.beginPath();
           ctx.moveTo(centerX - roadWidth/2, centerY - 40);
           ctx.lineTo(centerX + roadWidth/2, centerY - 40);
           ctx.stroke();
           ctx.setLineDash([]);
        }
      } else {
        ctx.fillRect(centerX - roadWidth / 2, 0, roadWidth, canvas.height);
        ctx.strokeStyle = '#fde047';
        ctx.setLineDash([30, 20]);
        ctx.beginPath();
        ctx.moveTo(centerX, 0); ctx.lineTo(centerX, canvas.height);
        ctx.stroke();
      }
    };

    const update = () => {
      const now = Date.now();
      const main = entities.find(e => e.type === 'main');
      const threat = entities.find(e => e.type === 'threat');
      const police = entities.find(e => e.type === 'police');
      const ped = entities.find(e => e.type === 'pedestrian');

      if (!main) return;

      const stopLineY = centerY + roadWidth / 2 + 50;
      
      if (isCorrectBehavior) {
        if (sign.name.includes('Stop') || sign.name.includes('Yield')) {
          if (main.y <= stopLineY && main.y > stopLineY - 15) {
            if (stopTimer === null) {
              stopTimer = now;
              main.vy = 0;
            } else if (now - stopTimer > 3000 && (!ped || ped.x > centerX + roadWidth/2)) {
              main.vy = -4;
            }
          }
        } else if (sign.name.includes('Speed')) {
          main.vy = -3; // Slower speed
        } else if (sign.scenario === 'Crosswalk') {
          if (ped && ped.x > centerX - roadWidth/2 && ped.x < centerX + roadWidth/2 && main.y < ped.y + 100) {
            main.vy = 0;
          } else {
            main.vy = -4;
          }
        }
      }

      if (police && !isCorrectBehavior) {
        police.flashing = true;
        if (main.y < centerY - 50) {
           main.vy *= 0.95;
           police.vy = main.vy;
           if (!outcome && main.vy > -0.5) setOutcome('PULLED OVER! Rule violation detected by law enforcement.');
        } else if (main.y < centerY + 100) {
           police.vy = -6; // Chase
        }
      }

      entities.forEach(e => {
        e.x += e.vx; e.y += e.vy;
        if (e.type === 'pedestrian') {
           e.angle = Math.sin(Date.now() / 200) * 0.2; // Walking wobble
        }
      });

      // Collisions
      if (threat && main) {
        const dx = main.x - threat.x; const dy = main.y - threat.y;
        if (Math.abs(dx) < 30 && Math.abs(dy) < 40) {
          main.vx = main.vy = threat.vx = threat.vy = 0;
          if (particles.length === 0) {
            for (let i = 0; i < 60; i++) {
              particles.push({
                x: main.x, y: main.y, vx: (Math.random() - 0.5) * 20, vy: (Math.random() - 0.5) * 20,
                life: 1.0, size: Math.random() * 10 + 5,
                color: ['#ef4444', '#f59e0b', '#3f3f46', '#ffffff'][Math.floor(Math.random() * 4)]
              });
            }
            setOutcome('CRITICAL COLLISION! Ignoring the sign caused a major accident.');
          }
        }
      }

      if (ped && main) {
         const dx = main.x - ped.x; const dy = main.y - ped.y;
         if (Math.abs(dx) < 25 && Math.abs(dy) < 30) {
            main.vy = 0; ped.vx = 0; ped.vy = 0;
            if (!outcome) setOutcome('TRAGEDY! You hit a pedestrian. Always yield at crosswalks.');
         }
      }

      if (main.y < -100 && !outcome) {
        setOutcome('Success! Road rules followed perfectly.');
      }

      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.life -= 0.01;
      });
      particles = particles.filter(p => p.life > 0);
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawRoads();

      entities.forEach(e => {
        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.rotate(e.angle);
        
        // Drop shadow
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;

        const img = images.current[e.type === 'main' ? 'mainCar' : e.type === 'threat' ? 'threatCar' : e.type === 'police' ? 'policeCar' : 'pedestrian'];
        
        if (img && img.complete && img.naturalWidth > 0) {
          if (e.type === 'threat' && sign.scenario === 'T-junction') {
            // threat car is horizontal
            ctx.drawImage(img, -e.height/2, -e.width/2, e.height, e.width);
          } else if (e.type === 'pedestrian') {
            ctx.drawImage(img, -e.width/2, -e.height/2, e.width, e.height);
          } else {
            ctx.drawImage(img, -e.width/2, -e.height/2, e.width, e.height);
          }
        } else {
          ctx.fillStyle = e.type === 'threat' ? '#ef4444' : e.type === 'main' ? '#3b82f6' : e.type === 'police' ? '#1e293b' : '#fca5a5';
          if (e.type === 'threat' && sign.scenario === 'T-junction') {
            ctx.fillRect(-e.height/2, -e.width/2, e.height, e.width);
          } else {
            ctx.fillRect(-e.width/2, -e.height/2, e.width, e.height);
          }
        }

        ctx.shadowColor = 'transparent';

        // Police Lights
        if (e.type === 'police' && e.flashing) {
          const flash = Math.floor(Date.now() / 150) % 2 === 0;
          ctx.fillStyle = flash ? '#ef4444' : '#3b82f6';
          ctx.globalAlpha = 0.8;
          ctx.beginPath();
          ctx.arc(0, -e.height/4, 40, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        ctx.restore();
      });

      // Particles
      particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;

      update();
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [sign, isCorrectBehavior, triggerKey, assetsLoaded]);

  if (!assetsLoaded) {
    return <div className="simulator-container" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'}}>Loading Photorealistic Assets...</div>;
  }

  return (
    <div className="simulator-container">
      <canvas ref={canvasRef} width={900} height={500} />
      {outcome && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', color: 'white',
          textAlign: 'center', padding: '2rem', animation: 'fadeIn 0.5s', zIndex: 10
        }}>
          <h2 style={{ fontSize: '3.5rem', margin: '0 0 1rem 0' }}>
            {outcome.startsWith('Success') ? '✅' : '🚨'}
          </h2>
          <p style={{ fontSize: '1.75rem', fontWeight: 'bold', maxWidth: '80%', lineHeight: 1.4 }}>{outcome}</p>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('reset-sim'))}
            style={{ marginTop: '2rem', background: 'var(--primary)', fontSize: '1.2rem', padding: '1rem 2rem' }}
          >
            Run Simulation Again
          </button>
        </div>
      )}
    </div>
  );
};
