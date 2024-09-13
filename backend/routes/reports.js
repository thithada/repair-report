// backend\routes\reports.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Report = require('../models/Report');
const { auth, adminAuth } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Get a specific report
router.get('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report', error: error.message });
  }
});

// Update report (for EditReportForm)
router.patch('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if the user is the owner of the report or an admin
    if (report.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission to edit this report' });
    }

    const updateData = { ...req.body };

    // Handle image update
    if (req.file) {
      // Delete old image if it exists
      if (report.imagePath) {
        fs.unlink(report.imagePath, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }
      updateData.imagePath = req.file.path;
    }

    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    req.io.emit('updateReport', updatedReport);
    res.json(updatedReport);
  } catch (error) {
    res.status(400).json({ message: 'Error updating report', error: error.message });
  }
});

// Create a new report with image upload
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const reportData = {
      ...req.body,
      createdBy: req.user._id
    };
    
    if (req.file) {
      reportData.imagePath = req.file.path;
    }

    const report = new Report(reportData);
    await report.save();
    
    req.io.emit('newReport', report);
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ message: 'Error creating report', error: error.message });
  }
});

// Get all reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports', error: error.message });
  }
});

// Create a new report
router.post('/', auth, async (req, res) => {
  try {
    const report = new Report({
      ...req.body,
      createdBy: req.user._id
    });
    await report.save();
    req.io.emit('newReport', report);
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ message: 'Error creating report', error: error.message });
  }
});

// Update report
router.patch('/:id', auth, adminAuth, async (req, res) => {
  try {
    const { status, note } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, note, updatedAt: Date.now() },
      { new: true }
    );
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    req.io.emit('updateReport', report);
    res.json(report);
  } catch (error) {
    res.status(400).json({ message: 'Error updating report', error: error.message });
  }
});

// Delete report
router.delete('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Check if the user is the owner of the report or an admin
    if (report.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission to delete this report' });
    }

    await Report.findByIdAndDelete(req.params.id);
    req.io.emit('deleteReport', req.params.id);
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting report', error: error.message });
  }
});

module.exports = router;