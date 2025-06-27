export const questionnaireData = {
    part1: [
      {
        id: 'primaryReasons',
        type: 'multi',
        text: 'What are your primary reasons for coming to Podium?',
        options: [
          'Improve general gut health',
          'Manage a chronic gut health issue',
          'Weight management',
          'Improve sleep',
          'Increase energy levels',
          'Support immune function',
          'Reduce bloating or digestive discomfort',
          'Improve skin health',
          'Improve mental clarity / reduce brain fog',
          'Balance mood / manage stress',
          'Other'
        ]
      },
      { id: 'mainFocus', type: 'single-dynamic', text: 'Of the goals you selected, which is your main focus right now?', dependsOn: 'primaryReasons' },
      { id: 'digestiveSymptoms', type: 'multi', text: 'Which of the following digestive symptoms do you regularly experience?', options: ['General gut discomfort', 'Bloating after meals', 'Constipation, diarrhea, or irregular bowel movements', 'None'] },
      { id: 'dietType', type: 'single', text: 'Which of these best describes your usual diet?', options: ['Omnivorous', 'Vegetarian', 'Vegan', 'Pescatarian', 'Other'] },
      { id: 'fruitVegServings', type: 'single', text: 'About how many servings of fruits and vegetables do you usually have per day?', options: ['0–1', '2–3', '4–5', '6+'] },
      { id: 'probiotics', type: 'single', text: 'Do you currently take probiotics or prebiotics?', options: ['Yes', 'No', "I'm not sure"] },
      { id: 'stressLevel', type: 'single', text: 'How would you describe your stress level most days?', options: ['Low', 'Moderate', 'High', 'Very High'] },
      { id: 'sleepQuality', type: 'single', text: 'Do you feel well-rested upon waking up?', options: ['Yes', 'No'] },
      { id: 'wearables', type: 'single', text: 'Do you track your health using wearables (like Fitbit, Apple Watch, Oura, etc.)?', options: ['Yes', 'No'] },
    ],
    part2: {
    'Digestive Health': [
        {
          id: 'digestive_symptom_frequency',
          type: 'single',
          text: 'How often do you experience gut discomfort?',
          options: ['Never', 'Occasionally', 'Weekly', 'Daily']
        },
        {
          id: 'experiences_bloating',
          type: 'single',
          text: 'How often do you feel bloated after eating?',
          options: ['Never', 'Occasionally', 'Weekly', 'Daily']
        },
        {
          id: 'has_constipation',
          type: 'single',
          text: 'How often do you experience constipation, diarrhea, or irregular bowel movements?',
          options: ['Never', 'Occasionally', 'Weekly', 'Daily']
        },
        {
          id: 'has_diarrhea',
          type: 'single',
          text: 'Do you experience diarrhoea or loose stools?',
          options: ['Yes', 'No']
        },
        {
          id: 'diagnosed_gut_conditions',
          type: 'multi',
          text: 'Do you have a diagnosed gut health condition (check all that apply)?',
          options: [
            'IBS', 'IBD', 'Crohn\'s Disease', 'Ulcerative Colitis', 'GERD / Acid Reflux', 'Celiac Disease', 'SIBO', 'Gastritis', 'Peptic Ulcer Disease', 'Gallbladder issues', 'Pancreatitis', 'Lactose intolerance', 'Fructose intolerance', 'Histamine intolerance', 'Eosinophilic Esophagitis', 'Diverticulosis / Diverticulitis', 'Bile Acid Malabsorption', 'Microscopic Colitis', 'Other (text)', 'No diagnosed gut condition'
          ]
        },
        {
          id: 'symptom_flare_frequency',
          type: 'single',
          text: 'How often do you have symptomatic "flares"?',
          options: ['Never', 'Rarely / Less than once a month', 'Monthly', 'Weekly', 'A few times a week', 'Daily']
        },
        {
          id: 'flare_start_timing',
          type: 'single',
          text: 'When do your flares typically begin?',
          options: ['In the morning', 'After meals', 'In the evening / at night', 'During stress or anxiety', 'After exercise or physical activity', 'No clear pattern', 'Other (text)']
        },
        {
          id: 'suspected_flare_triggers',
          type: 'multi',
          text: 'Which triggers do you suspect for your flares?',
          options: ['Certain foods', 'Alcohol', 'Caffeine', 'Stress or anxiety', 'Lack of sleep', 'Exercise', 'Medications', 'Hormonal changes', 'Weather changes', 'Other (text)', 'No known triggers']
        },
        {
          id: 'tried_remedies',
          type: 'multi',
          text: 'Which remedies have you tried for GI symptoms?',
          options: ['OTC medications', 'Probiotics', 'Prebiotics', 'Fiber supplements', 'Herbal remedies', 'Dietary changes', 'Digestive enzymes', 'Increased water intake', 'Exercise', 'Stress reduction', 'Acupuncture', 'Home remedies', 'Other (text)', 'No remedies tried']
        },
        {
          id: 'gi_diagnosis_year',
          type: 'number',
          text: 'In what year were you first diagnosed with a GI condition?'
        },
        {
          id: 'non_gut_health_conditions',
          type: 'multi',
          text: 'Do you currently have any of the following conditions?',
          options: ['Pre-diabetes / Insulin resistance', 'Type 2 diabetes', 'Hypertension', 'High cholesterol', 'Autoimmune disorder', 'Other (text)']
        }
    ],
    'Nutrition & Diet': [
        {
          id: 'diet_type',
          type: 'single',
          text: 'How would you describe your current diet?',
          options: ['Balanced & whole foods', 'High processed foods', 'Mostly plant-based', 'High protein / low carb', 'Other']
        },
        {
          id: 'daily_fruit_veg_servings',
          type: 'single',
          text: 'How many servings of fruits and vegetables do you usually have per day?',
          options: ['0–1', '2–3', '4–5', '6+']
        },
        {
          id: 'takes_probiotic_prebiotic',
          type: 'single',
          text: 'Do you currently take probiotics or prebiotics?',
          options: ['Yes', 'No']
        },
        {
          id: 'consumes_fermented_foods',
          type: 'single',
          text: 'Do you typically consume fermented foods?',
          options: ['Yes', 'No']
        },
        {
          id: 'processed_food_frequency',
          type: 'single',
          text: 'Frequency of processed food consumption:',
          options: ['Rarely', 'Sometimes', 'Often']
        },
        {
          id: 'daily_water_intake',
          type: 'number',
          text: 'Daily water intake (liters/ounces): ____'
        },
        {
          id: 'daily_calorie_intake',
          type: 'number',
          text: 'How many calories do you normally consume on a daily basis?'
        },
        {
          id: 'avoided_foods',
          type: 'multi',
          text: 'Are there any foods you avoid?',
          options: ['Yes', 'No', '(if Yes) Gluten-containing foods', 'Dairy', 'Eggs', 'Red meat', 'Processed meats', 'Seafood or shellfish', 'Legumes', 'Nuts or seeds', 'FODMAP foods', 'Spicy foods', 'Caffeine', 'Alcohol', 'Artificial sweeteners', 'Fried foods', 'Other (text)']
        },
        {
          id: 'specific_diet_or_fasting',
          type: 'multi',
          text: 'Are you currently following any specific diet plan or intermittent fasting protocol? (select all that apply)',
          options: ['Keto / Low Carb', 'Paleo', 'Mediterranean Diet', 'Vegetarian', 'Vegan', 'Whole30', 'Carnivore', 'DASH Diet', 'Low FODMAP', 'High Protein', 'Calorie restriction', 'Intermittent fasting (16/8', 'OMAD', 'Alternate day', '5:2)', 'Time-restricted eating', 'Juice cleanse', 'Other (text)', 'No specific diet or plan']
        }
    ],
    'Health Goals & Body Changes': [
        {
            id: 'podium_health_goals',
            type: 'multi',
            text: 'What are your primary reasons for coming to Podium, the best gut health app on the planet (select all that apply)?',
            options: [
            'Improve general gut health',
            'Manage chronic gut health issue',
            'Manage acute gut health issue',
            'Weight management',
            'Improve sleep',
            'Enhance athletic performance',
            'Increase energy levels',
            'Support immune function',
            'Reduce bloating or digestive discomfort',
            'Improve skin health',
            'Improve mental clarity / reduce brain fog',
            'Balance mood / manage stress',
            'Improve sex drive / libido',
            'Other (text)'
            ]
        },
        {
            id: 'podium__primary_health_goal',
            type: 'single-dynamic',
            text: 'Of the goals you selected, which is your main focus right now?',
            dependsOn: 'podium_health_goals'
        },
        {
            id: 'has_skin_health_changes',
            type: 'single',
            text: 'Do you notice any changes in skin health (e.g., acne, eczema, rashes)?',
            options: ['Yes', 'No']
        },
        {
            id: 'has_hair_loss',
            type: 'single',
            text: 'Do you experience hair thinning or hair loss?',
            options: ['Yes', 'No']
        },
        {
            id: 'sex_drive_level',
            type: 'single',
            text: 'How would you rate your current sex drive / libido?',
            options: ['Low', 'Moderate', 'High']
        },
        {
            id: 'recent_skin_hair_nail_changes',
            type: 'single',
            text: 'Have you noticed any changes in your skin, hair, or nails recently?',
            options: ['Yes', 'No']
        }
        ],
    'Physical Wellness': [
        {
          id: 'daily_sitting_hours',
          type: 'number',
          text: 'Hours per day spent sitting: ____'
        },
        {
          id: 'moderate_exercise_days',
          type: 'single',
          text: 'Days per week of moderate exercise: ____',
          options: ['0', '1', '2', '3', '4', '5', '6', '7']
        },
        {
          id: 'vigorous_exercise_days',
          type: 'single',
          text: 'Days per week of vigorous exercise: ____',
          options: ['0', '1', '2', '3', '4', '5', '6', '7']
        },
        {
          id: 'living_environment',
          type: 'single',
          text: 'Living environment:',
          options: ['Urban', 'Suburban', 'Rural']
        },
        {
          id: 'smokes_or_uses_tobacco',
          type: 'single',
          text: 'Do you smoke or use tobacco products?',
          options: ['Yes', 'No']
        },
        {
          id: 'drinks_alcohol',
          type: 'single',
          text: 'Do you drink alcohol?',
          options: ['No', 'Occasionally / socially', '1–3 times per week', '4–6 times per week', 'Daily']
        },
        {
          id: 'uses_recreational_drugs',
          type: 'single',
          text: 'Do you use recreational drugs?',
          options: ['Yes', 'No']
        }
    ],
    'Mental & Emotional Wellness': [
        {
            id: 'feel_well_rested_waking_up',
            type: 'single',
            text: 'Do you feel well-rested upon waking up?',
            options: ['Yes', 'No']
        },
        {
            id: 'stress_level_most_days',
            type: 'single',
            text: 'How would you describe your stress level most days?',
            options: ['Low', 'Moderate', 'High', 'Very High']
        },
        {
            id: 'has_brain_fog',
            type: 'single',
            text: 'Do you experience brain fog or trouble with mental clarity?',
            options: ['Yes', 'No']
        },
        {
            id: 'has_mood_swings_or_anxiety',
            type: 'single',
            text: 'Do you experience mood swings or anxiety?',
            options: ['Yes', 'No']
        },
        {
            id: 'has_fatigue',
            type: 'single',
            text: 'Do you experience fatigue or low energy during the day?',
            options: ['Yes', 'No']
        },
        {
            id: 'overall_energy_level',
            type: 'single',
            text: 'How would you describe your overall energy level?',
            options: ['Low', 'Moderate', 'High']
        },
        {
            id: 'has_headaches_or_migraines',
            type: 'single',
            text: 'Do you experience frequent headaches or migraines?',
            options: ['Yes', 'No']
        },
        {
            id: 'avg_sleep_hours',
            type: 'number',
            text: 'Average hours of sleep per night: ____'
        },
        {
            id: 'typical_stress_level',
            type: 'single',
            text: 'Typical stress level:',
            options: ['Low', 'Moderate', 'High', 'Very High']
        },
        {
            id: 'typical_mood',
            type: 'single',
            text: 'How would you describe your mood most of the time?',
            options: ['Positive', 'Neutral', 'Negative']
        },
        {
            id: 'practices_meditation',
            type: 'single',
            text: 'Do you meditate or practice mindfulness?',
            options: ['Yes', 'No']
        },
        {
            id: 'relaxation_activity_frequency',
            type: 'single',
            text: 'How often do you engage in relaxation activities?',
            options: ['Rarely / never', '1–2 times per week', '3–4 times per week', '5–6 times per week', 'Daily']
        },
        {
            id: 'feels_well_rested',
            type: 'single',
            text: 'Do you feel well-rested upon waking?',
            options: ['Yes', 'No']
        },
        {
            id: 'has_trouble_falling_asleep',
            type: 'single',
            text: 'Do you have trouble falling asleep?',
            options: ['Yes', 'No']
        },
        {
            id: 'wakes_up_at_night',
            type: 'single',
            text: 'Do you wake up during the night?',
            options: ['Yes', 'No']
        },
        {
            id: 'uses_sleep_aids',
            type: 'single',
            text: 'Do you use sleep aids (prescription or over-the-counter)?',
            options: ['Yes', 'No']
        }
        ],
    'Medications & Supplements': [
        {
            id: 'current_medications_list',
            type: 'multi',
            text: 'Are you currently taking any medications? (select all that apply)',
            options: [
            'None',
            'Acid reducers',
            'Anti-inflammatory drugs',
            'Pain relievers',
            'Antibiotics',
            'Antidepressants',
            'Blood pressure medications',
            'Cholesterol-lowering medications',
            'Diabetes medications',
            'Hormonal medications',
            'Sleep aids',
            'Allergy medications',
            'Laxatives or stool softeners',
            'Other (text)'
            ]
        },
        {
            id: 'recent_antibiotic_use',
            type: 'single',
            text: 'Have you taken antibiotics in the past 6 months?',
            options: ['Yes', 'No']
        },
        {
            id: 'herbal_or_nutritional_supplements',
            type: 'multi',
            text: 'Are you taking any herbal or nutritional supplements (other than probiotics/prebiotics)? (select all that apply)',
            options: [
            'None',
            'Multivitamins',
            'Vitamin D',
            'Magnesium',
            'Omega-3 / fish oil',
            'Collagen',
            'Fiber supplements',
            'Protein powders',
            'Herbal teas',
            'Adaptogens',
            'Turmeric / curcumin',
            'CBD / hemp product',
            'Other (text)'
            ]
        }
        ],
    }
  };