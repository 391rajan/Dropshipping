const NewsletterSubscriber = require('../models/NewsletterSubscriber');

exports.subscribeToNewsletter = async (req, res) => {
  const { email } = req.body;

  try {
    const existingSubscriber = await NewsletterSubscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }

    const newSubscriber = new NewsletterSubscriber({ email });
    await newSubscriber.save();

    res.status(201).json({ message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    res.status(500).json({ message: 'Error subscribing to newsletter', error: error.message });
  }
};
