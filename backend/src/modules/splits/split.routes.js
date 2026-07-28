const express = require('express');
const router = express.Router();
const { getAllSplits, getMySplits, createSplit, settleShare } = require('./split.controller');
const { protect, authorize } = require('../../common/middleware/auth');
const validate = require('../../common/middleware/validate');
const { createSplitSchema } = require('./split.validation');

router.use(protect);

router.get('/', authorize('Analyst', 'Admin'), getAllSplits);
router.get('/mine', authorize('Viewer', 'Analyst', 'Admin'), getMySplits);
router.post('/', authorize('Analyst', 'Admin'), validate(createSplitSchema), createSplit);
router.put('/:id/settle', authorize('Viewer', 'Analyst', 'Admin'), settleShare);

module.exports = router;
