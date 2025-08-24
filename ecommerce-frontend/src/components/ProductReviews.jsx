import React, { useEffect, useState } from 'react';
import { reviewAPI } from '../services/api';

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, [productId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewAPI.getProductReviews(productId);
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem('token')) {
      alert('Please login to submit a review');
      return;
    }
    setSubmitting(true);
    try {
      await reviewAPI.create({ ...form, productId });
      setForm({ rating: 5, comment: '' });
      fetchReviews();
    } catch (err) {
      console.error('Error submitting review:', err);
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-4">Product Reviews</h2>
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <select name="rating" value={form.rating} onChange={handleChange} className="border p-2 rounded">
          {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r>1?'s':''}</option>)}
        </select>
        <textarea name="comment" value={form.comment} onChange={handleChange} placeholder="Write a review..." className="w-full border p-2 rounded" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Review'}</button>
      </form>
      {loading ? <div>Loading...</div> : (
        <ul className="space-y-4">
          {reviews.map(r => (
            <li key={r._id} className="border p-4 rounded">
              <div className="font-medium">{r.user?.name || 'User'}</div>
              <div className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
              <div>{r.comment}</div>
              <div className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductReviews;
