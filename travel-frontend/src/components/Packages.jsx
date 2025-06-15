import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function Packages({ user }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("default");
  const [minReviews, setMinReviews] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const params = {};
        if (sortOption !== "default") params.sort = sortOption;
        if (minReviews > 0) params.minReviews = minReviews;

        const response = await axios.get("/packages", { params });
        setPackages(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch packages");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPackages();
  }, [sortOption, minReviews]);

  const handleReviewSubmit = async (packageId) => {
    try {
      await axios.post("/reviews", {
        packageId,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      
      // Refresh packages after review submission
      const response = await axios.get("/packages", {
        params: { sort: sortOption, minReviews }
      });
      setPackages(response.data);
      setShowReviewForm(null);
      setReviewData({ rating: 5, comment: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    }
  };

  if (loading) return <div className="loading">Loading packages...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="packages-container">
      <h2>Travel Packages</h2>
      
      <div className="sort-controls">
        <div className="sort-group">
          <label>Sort by:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="rating-high">Highest Rating</option>
            <option value="rating-low">Lowest Rating</option>
            <option value="reviews-high">Most Reviews</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Minimum Reviews:</label>
          <input
            type="number"
            min="0"
            value={minReviews}
            onChange={(e) => setMinReviews(Number(e.target.value))}
          />
        </div>
      </div>
      
      <div className="packages-grid">
        {packages.map(pkg => (
          <div key={pkg.id} className="package-card">
            <img 
              src={pkg.imageUrl || '/placeholder-image.jpg'} 
              alt={pkg.name} 
              className="package-image"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = '/placeholder-image.jpg'
              }}
            />
            <div className="package-details">
              <h3>{pkg.name}</h3>
              <p className="description">{pkg.description}</p>
              <p className="price">${pkg.price?.toFixed(2)}</p>
              
              <div className="rating-info">
                <div className="stars">
                  {pkg.averageRating ? (
                    <>
                      {'★'.repeat(Math.round(pkg.averageRating))}
                      {'☆'.repeat(5 - Math.round(pkg.averageRating))}
                      <span>({pkg.averageRating.toFixed(1)})</span>
                    </>
                  ) : 'No ratings'}
                </div>
                <div className="review-count">
                  {pkg.reviewCount || 0} reviews
                </div>
              </div>
              
              {pkg.companyName && (
                <p className="company">By: {pkg.companyName}</p>
              )}

              {/* Review Section */}
              <div className="review-section">
                <button 
                  className="toggle-reviews-btn"
                  onClick={() => setShowReviewForm(showReviewForm === pkg.id ? null : pkg.id)}
                >
                  {showReviewForm === pkg.id ? 'Hide Reviews' : 'Show Reviews'}
                </button>

                {showReviewForm === pkg.id && (
                  <div className="reviews-container">
                    {pkg.reviews?.length > 0 ? (
                      pkg.reviews.map(review => (
                        <div key={review.id} className="review-item">
                          <div className="review-rating">
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </div>
                          <p className="review-comment">{review.comment}</p>
                          <p className="review-author">- {review.username}</p>
                        </div>
                      ))
                    ) : (
                      <p>No reviews yet</p>
                    )}

                    {/* Add Review Form (only for logged in users) */}
                    {user && user.roles?.some(r => r.authority === "USER") && (
                      <div className="add-review-form">
                        <h4>Add Your Review</h4>
                        <div className="rating-input">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span 
                              key={star}
                              className={`star ${star <= reviewData.rating ? 'active' : ''}`}
                              onClick={() => setReviewData({...reviewData, rating: star})}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <textarea
                          placeholder="Share your experience..."
                          value={reviewData.comment}
                          onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                        />
                        <button 
                          className="submit-review-btn"
                          onClick={() => handleReviewSubmit(pkg.id)}
                          disabled={!reviewData.comment.trim()}
                        >
                          Submit Review
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Packages;