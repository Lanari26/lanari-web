const express = require('express');
const router = express.Router();
const { getTemplates, getCampaigns, getCampaign, createCampaign, sendCampaign, deleteCampaign } = require('../controllers/campaign.controller');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/templates', getTemplates);
router.get('/', getCampaigns);
router.get('/:id', getCampaign);
router.post('/', createCampaign);
router.post('/:id/send', sendCampaign);
router.delete('/:id', deleteCampaign);

module.exports = router;
