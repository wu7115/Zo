export const questionnaireDataPart2 = {
    'Symptoms & Flares': [
        { id: 'flareFrequency', type: 'single', text: 'How often do you have symptomatic “flares”?', options: ['Never', 'Rarely / Less than once a month', 'Monthly', 'Weekly', 'A few times a week', 'Daily'] },
        { id: 'flareTiming', type: 'multi', text: 'When do your flares typically begin?', options: ['In the morning', 'After meals', 'In the evening / at night', 'During stress or anxiety', 'After exercise', 'No clear pattern'], condition: (answers: any) => answers.flareFrequency !== 'Never' },
        { id: 'flareTriggers', type: 'multi', text: 'What do you suspect triggers your flares?', options: ['Certain foods', 'Alcohol', 'Caffeine', 'Stress', 'Lack of sleep', 'Exercise', 'Medications', 'Hormonal changes'], condition: (answers: any) => answers.flareFrequency !== 'Never' },
        { id: 'systemicSymptoms', type: 'multi', text: 'Which, if any, of these do you regularly experience?', options: ['Brain fog', 'Mood swings / anxiety', 'Fatigue / low energy', 'Frequent headaches'] },
        { id: 'energyLevel', type: 'single', text: 'How would you describe your overall energy level?', options: ['Low', 'Moderate', 'High'] },
        { id: 'externalChanges', type: 'multi', text: 'Have you noticed recent changes in any of the following?', options: ['Skin (e.g., acne, rashes)', 'Hair (e.g., thinning, loss)', 'Nails'] },
        { id: 'libido', type: 'single', text: 'How would you rate your current sex drive / libido?', options: ['Low', 'Moderate', 'High'] }
    ],
    'Diet, Nutrition & Supplements': [
        { id: 'specificDiets', type: 'multi', text: 'Are you currently following any specific diet plan or intermittent fasting protocol?', options: ['Keto / Low Carb', 'Paleo', 'Mediterranean Diet', 'Low FODMAP', 'Time-restricted eating', 'No specific diet or plan', 'Other'] },
        { id: 'calories', type: 'number', text: 'Roughly how many calories do you normally consume on a daily basis?', placeholder: 'e.g., 2000' },
        { id: 'fermentedFoods', type: 'single', text: 'Do you typically eat fermented foods (like yogurt, kimchi, or kombucha)?', options: ['Yes', 'No'] },
        { id: 'processedFoods', type: 'single', text: 'How often do you eat processed foods?', options: ['Rarely', 'Sometimes', 'Often'] },
        { id: 'waterIntake', type: 'number', text: 'About how much water do you drink per day (in ounces)?', placeholder: 'e.g., 64' },
        { id: 'foodAvoidance', type: 'multi', text: 'Are there any foods you actively avoid?', options: ['Gluten', 'Dairy', 'Eggs', 'Red meat', 'Spicy foods', 'Caffeine', 'Alcohol', 'Artificial sweeteners'] },
        { id: 'probioticBrands', type: 'multi', text: 'Which probiotic/prebiotic supplements are you taking?', options: ['Culturelle', 'Align', 'Garden of Life', 'Seed Daily Synbiotic', 'Other'], condition: (answers: any) => answers.probiotics === 'Yes' }, // Note: 'probiotics' answer comes from Part 1
        { id: 'otherSupplements', type: 'multi', text: 'Are you taking any other herbal or nutritional supplements?', options: ['None', 'Multivitamin', 'Vitamin D', 'Magnesium', 'Omega-3 / fish oil', 'Collagen'] }
    ],
    'Lifestyle & Habits': [
        { id: 'sleepHours', type: 'number', text: 'On average, how many hours of sleep do you get per night?', placeholder: 'e.g., 7', condition: (answers: any) => !answers.healthDataSynced?.includes('sleep') },
        { id: 'sleepIssues', type: 'multi', text: 'Which of the following sleep issues do you experience?', options: ['Trouble falling asleep', 'Waking up during the night', 'Not feeling rested upon waking'] },
        { id: 'sleepAids', type: 'single', text: 'Do you use sleep aids?', options: ['Yes', 'No'], condition: (answers: any) => answers.sleepIssues && answers.sleepIssues.length > 0 },
        { id: 'sittingHours', type: 'number', text: 'About how many hours per day do you usually spend sitting?', placeholder: 'e.g., 8' },
        { id: 'weeklyExercise', type: 'single', text: 'How would you describe your typical weekly exercise?', options: ['Mostly sedentary / Little to no formal exercise', 'Light activity (e.g., walking) on some days', 'Moderate exercise (e.g., brisk walking, cycling) 2-3 days a week', 'Moderate exercise 4 or more days a week', 'Vigorous exercise (e.g., running, HIIT) 1-3 days a week', 'A mix of moderate and vigorous exercise on most days'], condition: (answers: any) => !answers.healthDataSynced?.includes('exercise') },
        { id: 'mood', type: 'single', text: 'How would you describe your mood most of the time?', options: ['Positive', 'Neutral', 'Negative'] },
        { id: 'mindfulness', type: 'single', text: 'Do you meditate or practice mindfulness?', options: ['Yes', 'No'] },
        { id: 'relaxation', type: 'single', text: 'How often do you engage in relaxation activities?', options: ['Rarely / never', '1–2 times per week', 'Most days'] },
        { id: 'smoking', type: 'single', text: 'Do you smoke or use tobacco products?', options: ['Yes', 'No'] },
        { id: 'alcohol', type: 'single', text: 'How often do you drink alcohol?', options: ['Never', 'Occasionally / socially', '1–3 times per week', '4+ times per week'] },
        { id: 'recreationalDrugs', type: 'single', text: 'Do you use recreational drugs?', options: ['Never', 'Rarely', 'Occasionally', 'Prefer not to say'] }
    ],
    'Your Health History': [
         { id: 'diagnosedConditions', type: 'multi', text: 'Have you been diagnosed with a gut health condition?', options: ['No diagnosed gut condition', 'IBS', 'IBD', "Crohn’s Disease", 'Ulcerative Colitis', 'GERD / Acid Reflux', 'SIBO', 'Celiac Disease', 'Other'] },
         { id: 'diagnosisYear', type: 'number', text: 'In what year were you first diagnosed?', placeholder: 'YYYY', condition: (answers: any) => answers.diagnosedConditions && !answers.diagnosedConditions.includes('No diagnosed gut condition') && answers.diagnosedConditions.length > 0 },
         { id: 'otherHealthConditions', type: 'multi', text: 'Do you have any other diagnosed health conditions?', options: ['None', 'Pre-diabetes / Insulin resistance', 'Type 2 diabetes', 'Hypertension', 'High cholesterol', 'Autoimmune disorder', 'Other'] },
         { id: 'medications', type: 'multi', text: 'Are you currently taking any medications?', options: ['None', 'Acid reducers', 'Anti-inflammatory drugs', 'Antidepressants', 'Hormonal medications'] },
         { id: 'antibioticsLast6Months', type: 'single', text: 'Have you taken antibiotics in the past 6 months?', options: ['Yes', 'No'] },
         { id: 'remediesTried', type: 'multi', text: 'What remedies have you tried for GI symptoms?', options: ['None', 'OTC medications', 'Probiotics', 'Dietary changes', 'Exercise', 'Stress reduction'], condition: (answers: any) => answers.digestiveSymptoms && !answers.digestiveSymptoms.includes('None') && answers.digestiveSymptoms.length > 0 } // Note: 'digestiveSymptoms' answer comes from Part 1
    ],
    'A Few Final Details': [
         { id: 'age', type: 'number', text: 'What is your age?', placeholder: 'e.g., 35' },
         { id: 'sex', type: 'single', text: 'What is your biological sex?', options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
         { id: 'weight', type: 'number', text: 'What is your weight (in lbs)?', placeholder: 'e.g., 150', condition: (answers: any) => !answers.healthDataSynced?.includes('weight') },
         { id: 'height', type: 'text', text: 'What is your height (in ft and inches)?', placeholder: 'e.g., 5\' 10"', condition: (answers: any) => !answers.healthDataSynced?.includes('height') },
         { id: 'livingEnvironment', type: 'single', text: 'Which of these best describes your living environment?', options: ['Urban', 'Suburban', 'Rural'] },
         { id: 'occupation', type: 'text', text: 'What is your current occupation?', placeholder: 'e.g., Software Engineer' },
         { id: 'location', type: 'text', text: 'Where do you live?', placeholder: 'State/Province, Country' }
    ],
};