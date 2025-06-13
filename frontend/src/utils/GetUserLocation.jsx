import { useEffect } from 'react';

const GetUserLocation = () => {
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));

        try {
          const response = await fetch('/api/save‐location', {   
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latitude, longitude }),
          });

          if (!response.ok) {
            const errText = await response.text();
            console.error('Failed to send location:', errText);
          } else {
            console.log('Location successfully sent to backend.');
          }
        } catch (err) {
          console.error('Error sending location to backend:', err);
        }
      },
      (error) => {
        console.error('Error getting geolocation:', error);
      }
    );
  }, []);

  return null;
};

export default GetUserLocation;
