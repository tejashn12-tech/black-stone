import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { calculateNutritionMetrics } from '../services/nutritionCalculator';
import { generateFullDietPlan } from '../services/dietPlanGenerator';
import { UserDietProfile } from '../types/diet';
import { logger } from '../utils/logger';

export const dietRoutes = Router();

/**
 * POST /api/diet/calculate
 * Calculate scientific BMR, TDEE, macros, BMI, and hydration from user stats
 */
dietRoutes.post('/calculate', (req: Request, res: Response) => {
  try {
    const profile = req.body as UserDietProfile;
    if (!profile || !profile.weightKg || !profile.heightCm || !profile.age) {
      return res.status(400).json({
        success: false,
        error: 'Missing required profile fields: weightKg, heightCm, age'
      });
    }

    const metrics = calculateNutritionMetrics(profile);
    return res.json({
      success: true,
      metrics
    });
  } catch (err: any) {
    logger.error({ error: err?.message }, 'Error calculating nutrition metrics');
    return res.status(500).json({
      success: false,
      error: 'Failed to calculate nutrition metrics'
    });
  }
});

/**
 * POST /api/diet/generate
 * Generates 7-Day Personalized Meal Plan with optional Gemini AI enhancement
 */
dietRoutes.post('/generate', async (req: Request, res: Response) => {
  try {
    const profile = req.body as UserDietProfile;
    if (!profile || !profile.weightKg || !profile.heightCm || !profile.age) {
      return res.status(400).json({
        success: false,
        error: 'Missing required profile fields: weightKg, heightCm, age'
      });
    }

    // 1. Deterministic science-based nutrition calculation
    const metrics = calculateNutritionMetrics(profile);

    // 2. Base 7-day verified plan from trusted nutrition database
    const dietPlan = generateFullDietPlan(profile, metrics);

    // 3. Optional Gemini AI enhancement if GEMINI_API_KEY is available
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are the Head Sports Nutritionist and Executive Chef at Black Stone Fitness (BSF) Mysuru.
Review the following user profile and generated 7-day diet plan.
User Profile:
- Age: ${profile.age}, Sex: ${profile.sex}, Weight: ${profile.weightKg}kg, Target: ${profile.desiredWeightKg}kg
- Primary Goal: ${profile.primaryGoal}
- Diet Preference: ${profile.dietaryPreference}
- Allergies: ${profile.allergies.join(', ') || 'None'}
- Region: ${profile.region}
- Daily Calories: ${metrics.dailyCalorieTarget} kcal, Protein: ${metrics.proteinGrams}g, Carbs: ${metrics.carbsGrams}g, Fat: ${metrics.fatGrams}g

Provide:
1. A concise, inspiring 2-sentence coach note on how this exact meal structure supports their ${profile.primaryGoal}.
2. Three practical cooking or hydration hacks specific to ${profile.region.replace('_', ' ')}.
Respond strictly in plain text.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt
        });

        const aiText = response.text?.trim();
        if (aiText) {
          dietPlan.explanation = `${dietPlan.explanation}\n\n[BSF Head Coach AI Assessment]:\n${aiText}`;
          dietPlan.aiGenerated = true;
          dietPlan.modelUsed = 'gemini-3.8-flash';
        }
      } catch (aiErr: any) {
        logger.warn({ error: aiErr?.message }, 'Gemini enhancement failed, using verified fallback blueprint');
      }
    }

    return res.json({
      success: true,
      dietPlan
    });
  } catch (err: any) {
    logger.error({ error: err?.message }, 'Error generating diet plan');
    return res.status(500).json({
      success: false,
      error: 'Failed to generate personalized diet plan'
    });
  }
});
