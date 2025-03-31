import React from 'react';
import Card from './Card';
import '../styles/CardList.css';

const CardList = ({ items, category, stateId }) => {
  return (
    <div className="card-list">
      {items && items.length > 0 ? (
        items.map((item) => (
          <Card key={item.id} item={item} type={category} stateId={stateId} />
        ))
      ) : (
        <div className="no-items">No items found</div>
      )}
    </div>
  );
};

export default CardList;
