import React from 'react';

export default function ListingItem({ listing, id }) {
  return (
    <div>
      <p>{listing.name}</p>
      <p>{id}</p>
    </div>
  );
}
