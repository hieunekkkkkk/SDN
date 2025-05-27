const FeedbackBusiness = require('../entity/module/feedback_business.model');

exports.getAll = async (req, res) => {
  try {
    const data = await FeedbackBusiness.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await FeedbackBusiness.findById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const feedbackBusiness = new FeedbackBusiness(req.body);
    await feedbackBusiness.save();
    res.status(201).json(feedbackBusiness);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await FeedbackBusiness.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const data = await FeedbackBusiness.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 