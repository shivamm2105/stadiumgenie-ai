import { describe, it, expect } from 'vitest';
import {
  getMatchAssistantResponse,
  getTranslation,
  getIncidentSummaryAndResponse,
  getPriorityScore,
  getFoodQueueRecommendation,
  getTransitEcoRecommendation
} from '../services/geminiService.js';

describe('Gemini Simulation and Fallback Service', () => {
  it('should get mock responses for Match Assistant', async () => {
    const resSeat = await getMatchAssistantResponse('How to find seat?');
    expect(resSeat).toContain('accessibility');

    const resExit = await getMatchAssistantResponse('Where is the exit?');
    expect(resExit).toContain('Gate B');

    const resFood = await getMatchAssistantResponse('Where to eat food?');
    expect(resFood).toContain('Alamo Tacos');

    const resToilet = await getMatchAssistantResponse('Where is the toilet?');
    expect(resToilet).toContain('Restrooms');

    const resHelp = await getMatchAssistantResponse('Help me emergency');
    expect(resHelp).toContain('SOS');

    const resDefault = await getMatchAssistantResponse('Random string');
    expect(resDefault).toContain('FIFA World Cup 2026');
  });

  it('should get translation samples for target languages', async () => {
    const resEs = await getTranslation('where is the nearest restroom?', 'Spanish');
    expect(resEs).toBe('¿Dónde está el baño más cercano?');

    const resFr = await getTranslation('thank you for visiting stadiumgenie!', 'French');
    expect(resFr).toBe('Merci d\'avoir visité StadiumGenie!');

    const resDe = await getTranslation('where is the nearest restroom?', 'German');
    expect(resDe).toBe('Wo ist die nächste Toilette?');

    const resAr = await getTranslation('where is the nearest restroom?', 'Arabic');
    expect(resAr).toBe('أين يقع أقرب مرحاض؟');

    const resOther = await getTranslation('hello world', 'UnsupportedLang');
    expect(resOther).toBe('[Translated to UnsupportedLang]: hello world');
  });

  it('should analyze incident details simulator', async () => {
    const resHigh = await getIncidentSummaryAndResponse('a fight is starting in section 112', 'Security');
    expect(resHigh.priority).toBe('High');
    expect(resHigh.staffNeeded).toContain('Security');

    const resMed = await getIncidentSummaryAndResponse('medical emergency collapsed', 'Health');
    expect(resMed.priority).toBe('High');
    expect(resMed.staffNeeded).toContain('Medical');

    const resLow = await getIncidentSummaryAndResponse('water leak toilet flood', 'Facilities');
    expect(resLow.priority).toBe('Low');

    const resDefault = await getIncidentSummaryAndResponse('some basic thing', 'General');
    expect(resDefault.priority).toBe('Medium');
  });

  it('should prioritize maintenance tickets', async () => {
    const resHigh = await getPriorityScore('Broken glass in the corridor causing slips');
    expect(resHigh.priority).toBe('High');

    const resCritical = await getPriorityScore('Gate scanner is broken');
    expect(resCritical.priority).toBe('Critical');

    const resLow = await getPriorityScore('Spill on dirty bin');
    expect(resLow.priority).toBe('Low');

    const resDefault = await getPriorityScore('regular fix');
    expect(resDefault.priority).toBe('Medium');
  });

  it('should recommend concessions based on preference', async () => {
    const resVeg = await getFoodQueueRecommendation('vegan');
    expect(resVeg).toContain('Golden Goal Greens');

    const resTaco = await getFoodQueueRecommendation('taco');
    expect(resTaco).toContain('Alamo Tacos');

    const resDefault = await getFoodQueueRecommendation('burger');
    expect(resDefault).toContain('Strikers Burger Joint');
  });

  it('should recommend transit eco tips', async () => {
    const resMetro = await getTransitEcoRecommendation('Downtown', 'Metro');
    expect(resMetro).toContain('Metro Line 2');

    const resBus = await getTransitEcoRecommendation('Downtown', 'bus');
    expect(resBus).toContain('Stadium Shuttle');

    const resDefault = await getTransitEcoRecommendation('Downtown', 'taxi');
    expect(resDefault).toContain('rideshare');
  });
});
