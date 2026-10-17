import { jsPDF } from 'jspdf';
import { FullDietPlan, Meal } from '../types/diet';

/**
 * Loads an image from URL and converts it to a base64 JPEG data URL for jsPDF.
 * Uses an HTMLCanvasElement with crossOrigin='anonymous'.
 * Falls back to an elegant generated graphic if network or CORS fails.
 */
async function loadBase64Image(imageUrl?: string, mealName?: string, slot?: string): Promise<string> {
  if (imageUrl && typeof window !== 'undefined') {
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        // Add timestamp to bypass cached CORS issues
        const cacheBustUrl = imageUrl.includes('?') ? `${imageUrl}&cb=pdf` : `${imageUrl}?cb=pdf`;
        img.src = cacheBustUrl;

        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = 180;
            canvas.height = 180;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              // Draw rounded photo on canvas
              ctx.drawImage(img, 0, 0, 180, 180);
              resolve(canvas.toDataURL('image/jpeg', 0.85));
              return;
            }
          } catch (e) {
            reject(e);
          }
          reject(new Error('Canvas context failed'));
        };

        img.onerror = (e) => reject(e);

        // Timeout fallback after 2.5 seconds
        setTimeout(() => reject(new Error('Image load timeout')), 2500);
      });

      return dataUrl;
    } catch {
      // Fallback below
    }
  }

  // Fallback: Generate an elegant branded food icon canvas
  if (typeof window !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = 180;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Dark slate background
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, 180, 180);

      // Orange header bar
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(0, 0, 180, 12);

      // Icon circle
      ctx.beginPath();
      ctx.arc(90, 80, 45, 0, Math.PI * 2);
      ctx.fillStyle = '#27272a';
      ctx.fill();
      ctx.strokeStyle = '#fb923c';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Meal initials or text
      ctx.fillStyle = '#fb923c';
      ctx.font = 'bold 20px Helvetica, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BSF', 90, 75);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Helvetica, Arial, sans-serif';
      ctx.fillText('FOOD', 90, 95);

      // Slot name
      ctx.fillStyle = '#a1a1aa';
      ctx.font = 'bold 11px Helvetica, Arial, sans-serif';
      const slotText = (slot || 'MEAL').replace(/_/g, ' ').toUpperCase();
      ctx.fillText(slotText, 90, 150);

      return canvas.toDataURL('image/jpeg', 0.85);
    }
  }

  return '';
}

/**
 * Exports complete personalized diet plan to PDF with meal photos embedded.
 */
export async function exportDietPlanToPdf(
  plan: FullDietPlan,
  onProgress?: (progressText: string) => void
): Promise<void> {
  if (onProgress) onProgress('Preparing document and loading meal photos...');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 15;

  // Header Banner
  doc.setFillColor(24, 24, 27); // zinc-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(251, 146, 60); // orange-400
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('BLACK STONE FITNESS (BSF) MYSURU', 14, 12);

  doc.setTextColor(244, 244, 245); // zinc-100
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text('ATHLETIC DIET & PERSONALIZED NUTRITION BLUEPRINT (ILLUSTRATED)', 14, 19);

  doc.setFontSize(7.5);
  doc.setTextColor(161, 161, 170); // zinc-400
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 14, 19, { align: 'right' });

  y = 34;

  // User Profile & Metrics Summary Box
  doc.setFillColor(245, 245, 247);
  doc.roundedRect(14, y, pageWidth - 28, 30, 2, 2, 'F');
  doc.setDrawColor(228, 228, 231);
  doc.roundedRect(14, y, pageWidth - 28, 30, 2, 2, 'S');

  doc.setTextColor(24, 24, 27);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('ATHLETE TARGET METRICS', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const col1X = 18;
  const col2X = 65;
  const col3X = 115;
  const col4X = 160;

  doc.text(`Current Weight: ${plan.profile.weightKg} kg`, col1X, y + 13);
  doc.text(`Target Weight: ${plan.profile.desiredWeightKg} kg`, col1X, y + 19);
  doc.text(`Diet Type: ${plan.profile.dietaryPreference.replace('_', ' ')}`, col1X, y + 25);

  doc.text(`Daily Calories: ${plan.metrics.dailyCalorieTarget} kcal`, col2X, y + 13);
  doc.text(`BMR: ${plan.metrics.bmr} kcal`, col2X, y + 19);
  doc.text(`TDEE: ${plan.metrics.tdee} kcal`, col2X, y + 25);

  doc.text(`Protein: ${plan.metrics.proteinGrams}g`, col3X, y + 13);
  doc.text(`Carbs: ${plan.metrics.carbsGrams}g`, col3X, y + 19);
  doc.text(`Dietary Fat: ${plan.metrics.fatGrams}g`, col3X, y + 25);

  doc.text(`Fiber: ${plan.metrics.fiberGrams}g`, col4X, y + 13);
  doc.text(`Water: ${plan.metrics.hydrationLiters} L`, col4X, y + 19);
  doc.text(`BMI: ${plan.metrics.bmi} (${plan.metrics.bmiCategory})`, col4X, y + 25);

  y += 35;

  // Primary Goal text
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(234, 88, 12);
  doc.text(`Primary Goal: ${plan.profile.primaryGoal.replace(/_/g, ' ').toUpperCase()}`, 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(82, 82, 91);
  const splitRationale = doc.splitTextToSize(plan.metrics.goalRationale, pageWidth - 28);
  doc.text(splitRationale, 14, y);
  y += splitRationale.length * 3.8 + 4;

  // Visual Hand Portion Guide in PDF for easy understanding
  doc.setFillColor(254, 243, 199); // amber-100
  doc.roundedRect(14, y, pageWidth - 28, 14, 2, 2, 'F');
  doc.setTextColor(146, 64, 14); // amber-800
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('EASY HAND-PORTION GUIDE (NO SCALE NEEDED):', 18, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text('• Palm = Protein (120-150g)    • Fist = Carbs/Rice/Oats (1 cup)    • Cupped Hand = Snacks/Dal (30g)    • Thumb = Healthy Fats/Ghee (1 tbsp)', 18, y + 10);
  y += 18;

  // 7 Days Loop with Meal Photos
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(24, 24, 27);
  doc.text('7-DAY MEAL SCHEDULE WITH FOOD PHOTOS', 14, y);
  y += 6;

  // Pre-load all images in parallel for fast export
  const allMeals: { dayIndex: number; meal: Meal; photoBase64?: string }[] = [];
  for (let d = 0; d < plan.days.length; d++) {
    for (const m of plan.days[d].meals) {
      allMeals.push({ dayIndex: d, meal: m });
    }
  }

  // Load photos batch
  for (let i = 0; i < allMeals.length; i++) {
    const item = allMeals[i];
    if (onProgress) {
      onProgress(`Processing photo ${i + 1} of ${allMeals.length}...`);
    }
    item.photoBase64 = await loadBase64Image(item.meal.imageUrl, item.meal.name, item.meal.slot);
  }

  // Render Days & Meals
  for (let d = 0; d < plan.days.length; d++) {
    const day = plan.days[d];

    // Day Header
    if (y > 235) {
      doc.addPage();
      y = 15;
    }

    doc.setFillColor(24, 24, 27);
    doc.roundedRect(14, y, pageWidth - 28, 7.5, 1.5, 1.5, 'F');
    doc.setTextColor(251, 146, 60);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `DAY ${day.dayNumber}: ${day.dayName.toUpperCase()} — ${day.totalCalories} kcal | Protein: ${day.totalProtein}g | Carbs: ${day.totalCarbs}g | Fat: ${day.totalFat}g`,
      18,
      y + 5
    );
    y += 9.5;

    for (const meal of day.meals) {
      // Find loaded photo
      const mealData = allMeals.find(x => x.dayIndex === d && x.meal.id === meal.id);
      const photo = mealData?.photoBase64;

      const cardHeight = 25; // 25mm height for photo card
      if (y + cardHeight > 275) {
        doc.addPage();
        y = 15;
      }

      // Meal Card Box
      doc.setFillColor(250, 250, 252);
      doc.roundedRect(14, y, pageWidth - 28, cardHeight, 2, 2, 'F');
      doc.setDrawColor(228, 228, 231);
      doc.roundedRect(14, y, pageWidth - 28, cardHeight, 2, 2, 'S');

      // Meal Photo on Left
      if (photo) {
        try {
          doc.addImage(photo, 'JPEG', 16, y + 2.5, 20, 20);
        } catch {
          // If any problem embedding image, continue gracefully
        }
      }

      const textStartX = 39;

      // Slot Badge & Meal Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(234, 88, 12); // orange
      const slotTag = `[${meal.slot.replace(/_/g, ' ').toUpperCase()}]`;
      doc.text(slotTag, textStartX, y + 6);

      doc.setTextColor(24, 24, 27);
      doc.text(meal.name.slice(0, 45), textStartX + doc.getTextWidth(slotTag) + 2, y + 6);

      // Energy & Macros on right
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(234, 88, 12);
      doc.text(`${meal.calories} kcal`, textStartX, y + 11.5);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`Protein: ${meal.proteinGrams}g  ·  Carbs: ${meal.carbsGrams}g  ·  Fat: ${meal.fatGrams}g  ·  Fiber: ${meal.fiberGrams}g`, textStartX + 18, y + 11.5);

      // Cost badge on far right
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(217, 119, 6);
      doc.text(`≈ ₹${meal.estimatedCostInr}`, pageWidth - 18, y + 11.5, { align: 'right' });

      // Portion & Time
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`Portion: ${meal.portionDescription.slice(0, 68)}`, textStartX, y + 16.5);
      doc.text(`Time: ${meal.timeHint}  |  Prep Time: ${meal.prepTimeMinutes} mins`, textStartX, y + 21);

      y += cardHeight + 2.5;
    }

    y += 2;
  }

  // Safety Disclaimer Notice
  if (y > 250) {
    doc.addPage();
    y = 15;
  }
  y += 4;
  doc.setFontSize(7);
  doc.setTextColor(113, 113, 122);
  const disclaimer = doc.splitTextToSize(
    'DISCLAIMER: This diet blueprint is generated for athletic conditioning and informational purposes. It does not replace individualized medical advice or clinical care. Please consult a licensed dietitian or physician before undertaking extreme dietary modifications.',
    pageWidth - 28
  );
  doc.text(disclaimer, 14, y);

  if (onProgress) onProgress('Finalizing download...');
  // Trigger download
  doc.save(`BSF-Diet-Plan-Illustrated-${plan.profile.primaryGoal}-${Date.now()}.pdf`);
}
