import React, { useState, useEffect } from 'react';
import { createQuestion, getQuestionsForProduct } from '../services/api';

const ProductQuestions = ({ productId }) => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await getQuestionsForProduct(productId);
        setQuestions(data);
      } catch (err) {
        setError('Failed to fetch questions');
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [productId]);

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    try {
      const createdQuestion = await createQuestion({ productId, questionText: newQuestion });
      setQuestions([...questions, createdQuestion]);
      setNewQuestion('');
      alert('Question submitted successfully!');
    } catch (err) {
      setError('Failed to submit question');
      console.error('Error submitting question:', err);
      alert(err.response.data.message || 'Failed to submit question.');
    }
  };

  if (loading) {
    return <div className="text-center">Loading questions...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Customer Questions & Answers</h2>

      {/* Question Submission Form */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Ask a Question</h3>
        <form onSubmit={handleSubmitQuestion} className="space-y-4">
          <textarea
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Type your question here..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            required
          ></textarea>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit Question
          </button>
        </form>
      </div>

      {/* Display Questions */}
      <div className="space-y-6">
        {questions.length === 0 ? (
          <p className="text-gray-600">No questions asked yet. Be the first!</p>
        ) : (
          questions.map((q) => (
            <div key={q._id} className="p-6 bg-white rounded-lg shadow">
              <p className="font-semibold text-lg mb-2">Q: {q.questionText}</p>
              <p className="text-sm text-gray-500 mb-3">Asked by {q.user.name} on {new Date(q.createdAt).toLocaleDateString()}</p>
              {q.answer ? (
                <div className="mt-4 p-4 bg-gray-50 rounded-md border-l-4 border-blue-500">
                  <p className="font-semibold text-blue-700">A: {q.answer}</p>
                  <p className="text-xs text-gray-500 mt-1">Answered by {q.answeredBy?.name || 'Admin'} on {new Date(q.answeredAt).toLocaleDateString()}</p>
                </div>
              ) : (
                <p className="text-gray-500 italic mt-4">No answer yet.</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductQuestions;
