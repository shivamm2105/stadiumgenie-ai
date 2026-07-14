import {
  getMatchAssistantResponse,
  getTranslation,
  getIncidentSummaryAndResponse,
  getPriorityScore,
  getFoodQueueRecommendation,
  getTransitEcoRecommendation
} from '../services/geminiService.js';

export async function handleMatchAssistant(req, res, next) {
  try {
    const { query, chatHistory } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    const reply = await getMatchAssistantResponse(query, chatHistory);
    res.json({ reply });
  } catch (error) {
    next(error);
  }
}

export async function handleTranslation(req, res, next) {
  try {
    const { text, targetLanguage } = req.body;
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Text and targetLanguage are required parameters' });
    }
    const translatedText = await getTranslation(text, targetLanguage);
    res.json({ translatedText });
  } catch (error) {
    next(error);
  }
}

export async function handleIncidentSummary(req, res, next) {
  try {
    const { description, category } = req.body;
    if (!description || !category) {
      return res.status(400).json({ error: 'Description and category are required' });
    }
    const summaryData = await getIncidentSummaryAndResponse(description, category);
    res.json({ summaryData });
  } catch (error) {
    next(error);
  }
}

export async function handlePriorityScore(req, res, next) {
  try {
    const { details } = req.body;
    if (!details) {
      return res.status(400).json({ error: 'Maintenance ticket details are required' });
    }
    const priorityData = await getPriorityScore(details);
    res.json({ priorityData });
  } catch (error) {
    next(error);
  }
}

export async function handleFoodRecommendation(req, res, next) {
  try {
    const { dietaryPreference, crowdDensity, gatesOccupancy } = req.body;
    const recommendation = await getFoodQueueRecommendation(
      dietaryPreference || 'None',
      crowdDensity || 'Medium',
      gatesOccupancy || 'Gate A: 90%, Gate B: 35%'
    );
    res.json({ recommendation });
  } catch (error) {
    next(error);
  }
}

export async function handleTransitEco(req, res, next) {
  try {
    const { destination, preference, gateLoad } = req.body;
    if (!destination || !preference) {
      return res.status(400).json({ error: 'Destination and preference parameters are required.' });
    }
    const recommendation = await getTransitEcoRecommendation(destination, preference, gateLoad);
    res.json({ recommendation });
  } catch (error) {
    next(error);
  }
}
