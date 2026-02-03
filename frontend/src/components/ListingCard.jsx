
export default function ListingCard({ listing }) {
    const {
        foodType,
        quantity,
        quantityUnit,
        redistributionMode,
        preparationTime,
        description
    } = listing;

    const isDonation = redistributionMode === 'donation';

    return (
        <article className="listing-card">
            <div className="listing-image-placeholder">
                {/* Potentially an icon or image based on foodType could go here */}
                <span className="food-icon">🍎</span>
            </div>
            <div className="listing-content">
                <div className="listing-header">
                    <span className={`badge ${isDonation ? 'badge-donation' : 'badge-discount'}`}>
                        {isDonation ? 'Donation' : 'Discounted'}
                    </span>
                    <span className="listing-time">{preparationTime}</span>
                </div>

                <h3>{foodType}</h3>

                <div className="listing-details">
                    <p className="quantity">
                        <strong>Quantity:</strong> {quantity} {quantityUnit || 'kg'}
                    </p>
                    {description && <p className="description">{description}</p>}
                </div>

                <div className="card-actions">
                    <button className="btn-claim">Claim</button>
                </div>
            </div>
        </article>
    );
}
