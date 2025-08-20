import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

// Types
interface BluerayProps {
  imgUrl: string;
  filmId: string;
  filmTitle: string;
  filmTrailer?: string;
  onSelect?: (filmId: string) => void;
  onClose?: () => void;
  isSelected?: boolean;
  isExpanded?: boolean;
  isDetailsOpen?: boolean;
}

interface BluerayInterfaceProps {
  films: Array<{
    id: string;
    title: string;
    imgUrl: string;
    trailer?: string;
  }>;
  onFilmSelect?: (filmId: string) => void;
  onFilmClose?: () => void;
}

// Template component interface
interface TemplateProps {
  filmId: string;
  filmTitle: string;
}

// Template components (placeholder implementations)
const Template0: React.FC<TemplateProps> = ({ filmId, filmTitle }) => (
  <div className="template-0">
    <h3>Default Template</h3>
    <p>Film: {filmTitle}</p>
    <p>ID: {filmId}</p>
  </div>
);

const Template01: React.FC<TemplateProps> = ({ filmId, filmTitle }) => (
  <div className="template-01">
    <h3>Template 01</h3>
    <p>Film: {filmTitle}</p>
    <p>ID: {filmId}</p>
  </div>
);

// Add more templates as needed...
const templateMap: Record<string, React.FC<TemplateProps>> = {
  'item01': Template01,
  // Add more mappings as needed
};

// Individual Blueray component
const Blueray: React.FC<BluerayProps> = ({
  imgUrl,
  filmId,
  filmTitle,
  filmTrailer,
  onSelect,
  onClose,
  isSelected = false,
  isExpanded = false,
  isDetailsOpen = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTrailer, setIsTrailer] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    if (onSelect) {
      onSelect(filmId);
    }
  }, [onSelect, filmId]);

  const toggleTrailer = useCallback(() => {
    setIsTrailer(!isTrailer);
  }, [isTrailer]);

  const getTemplateComponent = useCallback(() => {
    return templateMap[filmId] || Template0;
  }, [filmId]);

  const TemplateComponent = getTemplateComponent();

  const getBluerayClasses = () => {
    const baseClasses = ['blueray'];
    
    if (isSelected) {
      baseClasses.push('scroll-open');
    }
    
    if (isDetailsOpen) {
      baseClasses.push('details-open');
    }
    
    if (isHovered && !isSelected) {
      baseClasses.push('hovered');
    }
    
    return baseClasses.join(' ');
  };

  return (
    <>
      <div
        ref={elementRef}
        className={getBluerayClasses()}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundImage: `url(${imgUrl})`,
        }}
      >
        {!isSelected && (
          <div className="text-title">
            {filmTitle}
          </div>
        )}
      </div>

      {isSelected && isExpanded && (
        <>
          <div className="title-wrapper fade-in">
            <div className="title">
              {filmTitle}
            </div>
          </div>
          <div className="fade-in content">
            <TemplateComponent filmId={filmId} filmTitle={filmTitle} />
          </div>
        </>
      )}

      {isTrailer && filmTrailer && (
        <div className="video-overlay" onClick={toggleTrailer}>
          <div className="video-content">
            <video controls autoPlay>
              <source src={filmTrailer} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <button className="close-button" onClick={toggleTrailer}>
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Main BluerayInterface component
const BluerayInterface: React.FC<BluerayInterfaceProps> = ({
  films,
  onFilmSelect,
  onFilmClose
}) => {
  const [selectedFilmId, setSelectedFilmId] = useState<string | null>(null);
  const [expandedFilmId, setExpandedFilmId] = useState<string | null>(null);
  const [detailsOpenFilmId, setDetailsOpenFilmId] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Handle film selection
  const handleFilmSelect = useCallback((filmId: string) => {
    if (selectedFilmId === filmId) {
      // If same film is clicked again, expand to details
      if (expandedFilmId === filmId) {
        setDetailsOpenFilmId(filmId);
        setExpandedFilmId(null);
      } else {
        // Expand the film
        setExpandedFilmId(filmId);
        setDetailsOpenFilmId(null);
      }
    } else {
      // Select new film
      setSelectedFilmId(filmId);
      setExpandedFilmId(filmId);
      setDetailsOpenFilmId(null);
    }

    if (onFilmSelect) {
      onFilmSelect(filmId);
    }
  }, [selectedFilmId, expandedFilmId, onFilmSelect]);

  // Handle film close
  const handleFilmClose = useCallback(() => {
    setSelectedFilmId(null);
    setExpandedFilmId(null);
    setDetailsOpenFilmId(null);
    
    if (onFilmClose) {
      onFilmClose();
    }
  }, [onFilmClose]);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update CSS custom properties based on scroll
  useEffect(() => {
    if (scrollY > 150) {
      if (screenWidth > 1200) {
        document.documentElement.style.setProperty('--button-top-offset', '-30px');
        document.documentElement.style.setProperty('--button-right-offset', 'calc(50% + 475px)');
      } else {
        document.documentElement.style.setProperty('--button-top-offset', '-30px');
        document.documentElement.style.setProperty('--button-right-offset', 'calc(85%)');
      }
    } else if (scrollY < 200) {
      if (screenWidth > 1200) {
        document.documentElement.style.setProperty('--button-top-offset', '15vh');
        document.documentElement.style.setProperty('--button-right-offset', 'calc(50% + 375px)');
      } else {
        document.documentElement.style.setProperty('--button-top-offset', '15vh');
        document.documentElement.style.setProperty('--button-right-offset', 'calc(85%)');
      }
    }
  }, [scrollY, screenWidth]);

  return (
    <div className="blueray-interface">
      <div className="blueray-container">
        {films.map((film) => (
          <Blueray
            key={film.id}
            imgUrl={film.imgUrl}
            filmId={film.id}
            filmTitle={film.title}
            filmTrailer={film.trailer}
            onSelect={handleFilmSelect}
            onClose={handleFilmClose}
            isSelected={selectedFilmId === film.id}
            isExpanded={expandedFilmId === film.id}
            isDetailsOpen={detailsOpenFilmId === film.id}
          />
        ))}
      </div>

      {selectedFilmId && (
        <button 
          className="close-button"
          onClick={handleFilmClose}
          style={{
            '--button-top-offset': '15vh',
            '--button-right-offset': screenWidth > 1200 ? 'calc(50% + 375px)' : 'calc(85%)'
          } as React.CSSProperties}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default BluerayInterface;
export type { BluerayProps, BluerayInterfaceProps };
