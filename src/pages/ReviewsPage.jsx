import React from 'react';

export default function ReviewsPage() {
  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h2 className="mb-3">Customer Reviews</h2>
          <div className="list-group">
            <div className="list-group-item">
              <strong>Ana</strong>
              <p className="mb-0">"Maganda at maaliwalas ang salon. Sobra akong satisfied sa haircut!"</p>
            </div>
            <div className="list-group-item">
              <strong>JM</strong>
              <p className="mb-0">"Mabilis ang serbisyo at very friendly ang staff."</p>
            </div>
            <div className="list-group-item">
              <strong>Mika</strong>
              <p className="mb-0">"Highly recommended! Ang ganda ng color at treatment."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
