const express = require('express');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const router = express.Router();

// Download nutrition guide
router.get('/guide/download', auth, async (req, res) => {
  try {
    // Path to the nutrition guide PDF (you can create this file)
    const filePath = path.join(__dirname, '../assets/hospital-nutrition-guide.pdf');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      // If file doesn't exist, generate a simple text response or return error
      return res.status(404).json({ message: 'Nutrition guide not found' });
    }

    const filename = 'hospital-nutrition-guide.pdf';
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache');
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Error downloading nutrition guide:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Alternative: Generate a simple PDF on-the-fly (if you don't have a static file)
router.get('/guide/generate', auth, async (req, res) => {
  try {
    // Simple text content for demonstration
    const content = `
HOSPITAL NUTRITION GUIDE

Table of Contents:
1. Balanced Nutrition During Recovery
2. Hydration Guidelines
3. Meal Planning
4. Special Dietary Considerations
5. Recovery Foods

1. BALANCED NUTRITION DURING RECOVERY
A balanced diet is crucial for healing and recovery. Include:
- Lean proteins for tissue repair
- Complex carbohydrates for energy
- Healthy fats for nutrient absorption
- Vitamins and minerals for immune support

2. HYDRATION GUIDELINES
- Aim for 8 glasses of water daily
- Increase intake if you have fever
- Monitor urine color (should be light yellow)
- Include water-rich foods like fruits and vegetables

3. MEAL PLANNING
- Eat regular meals to maintain energy
- Include all food groups
- Plan for 5-6 small meals instead of 3 large ones
- Prepare meals in advance when possible

4. SPECIAL DIETARY CONSIDERATIONS
- Follow any restrictions provided by your healthcare team
- Be aware of food allergies and intolerances
- Consider texture modifications if swallowing is difficult
- Monitor portion sizes

5. RECOVERY FOODS
Best foods for healing:
- Protein: Fish, poultry, eggs, legumes
- Vitamin C: Citrus fruits, berries, bell peppers
- Zinc: Nuts, seeds, whole grains
- Anti-inflammatory: Fatty fish, leafy greens

For more information, consult with your healthcare provider or registered dietitian.

© ${new Date().getFullYear()} Hospital Nutrition Department
    `;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="nutrition-guide.txt"');
    res.send(content);
    
  } catch (error) {
    console.error('Error generating nutrition guide:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get nutrition tips
router.get('/tips', auth, async (req, res) => {
  try {
    const tips = [
      {
        id: 1,
        category: 'Hydration',
        tip: 'Drink water before you feel thirsty',
        description: 'Thirst is a late indicator of dehydration'
      },
      {
        id: 2,
        category: 'Protein',
        tip: 'Include protein in every meal',
        description: 'Helps with tissue repair and wound healing'
      },
      {
        id: 3,
        category: 'Fruits & Vegetables',
        tip: 'Eat a rainbow of colors',
        description: 'Different colors provide different nutrients'
      }
    ];
    
    res.json(tips);
  } catch (error) {
    console.error('Error fetching nutrition tips:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;