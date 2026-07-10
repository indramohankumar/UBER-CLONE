const mapService = require('../services/maps.service');

const getCoordinates = async (req, res) => {
    try {
        const { address } = req.query;
        if (!address) {
            return res.status(400).json({ success: false, message: "Address is required in query params" });
        }
        
        const coordinates = await mapService.getCoordinates(address);
        
        res.status(200).json({
            success: true,
            data: coordinates
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getSuggestions = async (req, res) => {
    try {
        const { input } = req.query;
        if (!input) {
            return res.status(400).json({ success: false, message: "Input is required in query params" });
        }
        
        const suggestions = await mapService.getAutoCompleteSuggestions(input);
        
        res.status(200).json({
            success: true,
            suggestions: suggestions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getCoordinates,
    getSuggestions
};
