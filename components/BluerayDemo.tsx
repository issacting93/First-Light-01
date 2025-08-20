import React from 'react';
import BluerayInterface from './BluerayInterface';
import './BluerayInterface.css';

// Sample film data
const sampleFilms = [
  {
    id: 'item01',
    title: 'The Matrix',
    imgUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop',
    trailer: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
  },
  {
    id: 'item02',
    title: 'Blade Runner',
    imgUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
    trailer: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
  },
  {
    id: 'item03',
    title: 'Inception',
    imgUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    trailer: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
  },
  {
    id: 'item04',
    title: 'Interstellar',
    imgUrl: 'https://images.unsplash.com/photo-1446776811953-b23d0bd63ac2?w=400&h=600&fit=crop',
    trailer: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
  },
  {
    id: 'item05',
    title: 'Arrival',
    imgUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop',
    trailer: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
  }
];

const BluerayDemo: React.FC = () => {
  const handleFilmSelect = (filmId: string) => {
    console.log('Selected film:', filmId);
    // You can add your custom logic here
    // For example, navigate to a new page, open a modal, etc.
  };

  const handleFilmClose = () => {
    console.log('Film closed');
    // You can add your custom logic here
    // For example, reset state, close modals, etc.
  };

  return (
    <div className="blueray-demo">
      <h1>Blueray Interface Demo</h1>
      <p>Click on any film to expand it. Click again to open details.</p>
      
      <BluerayInterface
        films={sampleFilms}
        onFilmSelect={handleFilmSelect}
        onFilmClose={handleFilmClose}
      />
      
      <div className="demo-info">
        <h3>Features:</h3>
        <ul>
          <li>Hover to expand film cards</li>
          <li>Click to select and expand films</li>
          <li>Responsive design for mobile and desktop</li>
          <li>Scroll-based animations</li>
          <li>Template system for custom content</li>
          <li>Video trailer support</li>
        </ul>
      </div>
    </div>
  );
};

export default BluerayDemo;
