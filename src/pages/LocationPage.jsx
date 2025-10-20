import React from 'react';

export default function LocationPage() {
  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h2 className="mb-3">Our Location</h2>
          <p className="mb-2"><strong>Address:</strong> Zone IV, Socorro, Oriental Mindoro</p>
          <div className="ratio ratio-16x9 rounded overflow-hidden">
            <iframe
              title="Salon Location Map"
              src="https://www.google.com/maps?q=Zone%20IV%2C%20Socorro%2C%20Oriental%20Mindoro&output=embed"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
}
