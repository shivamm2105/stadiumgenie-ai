import {
  getMatchAssistantResponse,
  getTranslation,
  getIncidentSummaryAndResponse,
  getPriorityScore,
  getFoodQueueRecommendation,
  getTransitEcoRecommendation
} from '../services/geminiService.js';

/**
 * Controller to handle conversational search queries from the Gemini Match Assistant.
 * @param {object} req - Express request object containing query and optional chatHistory.
 * @param {object} res - Express response object returning the AI text response.
 * @param {function} next - Express next middleware callback.
 */
export async function handleMatchAssistant(req, res, next) {
  try {
    const { query, chatHistory } = req.body;
    const reply = await getMatchAssistantResponse(query, chatHistory);
    res.json({ reply });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller to translate inputs into spanish, french, german, arabic, etc.
 * @param {object} req - Express request object containing text and targetLanguage.
 * @param {object} res - Express response object returning translatedText.
 * @param {function} next - Express next middleware callback.
 */
export async function handleTranslation(req, res, next) {
  try {
    const { text, targetLanguage } = req.body;
    const translatedText = await getTranslation(text, targetLanguage);
    res.json({ translatedText });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller to trigger Gemini incident prioritization and dispatcher checklist summaries.
 * @param {object} req - Express request object containing description and category.
 * @param {object} res - Express response object returning suggested actions, priorities, and responders.
 * @param {function} next - Express next middleware callback.
 */
export async function handleIncidentSummary(req, res, next) {
  try {
    const { description, category } = req.body;
    const summaryData = await getIncidentSummaryAndResponse(description, category);
    res.json({ summaryData });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller to evaluate maintenance description priorities, resolution ETAs, and assignments.
 * @param {object} req - Express request object containing report details.
 * @param {object} res - Express response object returning the priority level structure.
 * @param {function} next - Express next middleware callback.
 */
export async function handlePriorityScore(req, res, next) {
  try {
    const { details } = req.body;
    const priorityData = await getPriorityScore(details);
    res.json({ priorityData });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller to plan dining options and routes to concessions.
 * @param {object} req - Express request object containing dietaryPreference, crowdDensity, and gatesOccupancy.
 * @param {object} res - Express response object returning AI recommendations.
 * @param {function} next - Express next middleware callback.
 */
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

/**
 * Controller to fetch electric transit guidance and eco-friendly carbon saving calculations.
 * @param {object} req - Express request object containing destination, preference, and gateLoad.
 * @param {object} res - Express response object returning transit directions.
 * @param {function} next - Express next middleware callback.
 */
export async function handleTransitEco(req, res, next) {
  try {
    const { destination, preference, gateLoad } = req.body;
    const recommendation = await getTransitEcoRecommendation(destination, preference, gateLoad);
    res.json({ recommendation });
  } catch (error) {
    next(error);
  }
}
