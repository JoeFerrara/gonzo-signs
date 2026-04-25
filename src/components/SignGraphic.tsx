import React, { useState } from 'react';
import type { Sign } from '../data/signs';

interface SignGraphicProps {
  sign: Sign;
}

export const SignGraphic: React.FC<SignGraphicProps> = ({ sign }) => {
  const [imgError, setImgError] = useState(false);

  // Special cases where the ID in our data doesn't perfectly match the Wikimedia filename
  const getImageUrl = (id: string) => {
    let filenameId = id;
    if (id === 'R2-1_35') filenameId = 'R2-1'; // Use generic speed limit if specific one fails
    return `https://commons.wikimedia.org/wiki/Special:FilePath/MUTCD_${filenameId}.svg`;
  };

  if (!imgError) {
    return (
      <img 
        src={getImageUrl(sign.id)} 
        alt={sign.name}
        onError={() => setImgError(true)}
        style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
      />
    );
  }

  // Fallback CSS rendering
  const isYellow = sign.color === '#FFCC00';
  
  let baseStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    textAlign: 'center',
    color: isYellow ? '#000' : '#FFF',
    position: 'relative',
    boxSizing: 'border-box'
  };

  switch (sign.shape) {
    case 'Octagon':
      baseStyle = {
        ...baseStyle,
        width: '100%',
        aspectRatio: '1/1',
        backgroundColor: sign.color,
        clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
        border: '4px solid white',
        fontSize: '0.8em'
      };
      return <div style={baseStyle}>STOP</div>;
    case 'Triangle':
      baseStyle = {
        ...baseStyle,
        width: '100%',
        aspectRatio: '1.15/1',
        backgroundColor: 'transparent',
        borderLeft: '50px solid transparent',
        borderRight: '50px solid transparent',
        borderTop: `86px solid ${sign.color}`,
        position: 'relative',
        color: '#CC0000'
      };
      return (
        <div style={{ width: '100%', position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: 0, height: 0, borderLeft: '40px solid transparent', borderRight: '40px solid transparent', borderTop: `70px solid ${sign.color}`
          }} />
          <div style={{
            position: 'absolute', top: '-60px', width: 0, height: 0, borderLeft: '30px solid transparent', borderRight: '30px solid transparent', borderTop: '50px solid white'
          }} />
          <span style={{ position: 'absolute', top: '-45px', fontSize: '0.6em', fontWeight: 'bold' }}>YIELD</span>
        </div>
      );
    case 'Diamond':
      baseStyle = {
        ...baseStyle,
        width: '70%',
        margin: '15%',
        aspectRatio: '1/1',
        backgroundColor: sign.color,
        transform: 'rotate(45deg)',
        border: '3px solid black',
        borderRadius: '2px'
      };
      return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <div style={baseStyle}>
             <div style={{ transform: 'rotate(-45deg)', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10%' }}>
               <span style={{ fontSize: '0.5em', lineHeight: 1.1 }}>{sign.name.replace('Ahead', '')}</span>
             </div>
          </div>
        </div>
      );
    case 'Circle':
      baseStyle = {
        ...baseStyle,
        width: '90%',
        margin: '5%',
        aspectRatio: '1/1',
        backgroundColor: sign.color,
        borderRadius: '50%',
        border: '3px solid black'
      };
      return (
        <div style={baseStyle}>
          <span style={{ fontSize: '1.5em', letterSpacing: '2px' }}>R X R</span>
        </div>
      );
    case 'Rectangle':
    default:
      baseStyle = {
        ...baseStyle,
        width: '80%',
        margin: '10%',
        aspectRatio: '2/3',
        backgroundColor: sign.color,
        border: '2px solid black',
        color: 'black',
        flexDirection: 'column',
        padding: '5px'
      };
      return (
        <div style={baseStyle}>
          <span style={{ fontSize: '0.5em', lineHeight: 1.2 }}>{sign.name}</span>
        </div>
      );
  }
};
