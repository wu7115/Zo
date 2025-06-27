export const trackingQuestions = {
  'Digestive Health': [
    {
        'id': 'bowel_movements_today',
        'type': 'number',
        'text': 'Total Number of bowel movements today: ____',
        'timeOfDay': 'Evening',
        'placeholder': 'e.g., 1'
    },
    {
        'id': 'bowel_urgency_today',
        'type': 'single',
        'text': 'Did you feel any urgency or need to rush to the bathroom today?',
        'timeOfDay': 'Anytime',
        'options': [
            'Yes',
            'No'
        ]
    },
    {
        'id': 'bowel_difficulty_today',
        'type': 'single',
        'text': 'Did you have any difficulty passing stools today?',
        'timeOfDay': 'Anytime',
        'options': [
            'Yes',
            'No'
        ]
    },
    {
        'id': 'bowel_ease',
        'type': 'single',
        'text': 'Were your bowel movements easy or did you strain?',
        'timeOfDay': 'Anytime',
        'options': [
            'Easy',
            'Strain'
        ]
    },
    {
        'id': 'complete_bowel_emptying',
        'type': 'single',
        'text': 'Did you feel like you completely emptied your bowels?',
        'timeOfDay': 'Anytime',
        'options': [
            'Yes',
            'No'
        ]
    },
    {
        'id': 'incomplete_bowel_movements',
        'type': 'single',
        'text': 'Did you have any incomplete bowel movements today?',
        'timeOfDay': 'Anytime',
        'options': [
            'Yes',
            'No'
        ]
    },
    {
        'id': 'unusual_stool_color',
        'type': 'single',
        'text': 'Did you notice any unusual color in your stools today?',
        'timeOfDay': 'Anytime',
        'options': [
            'Yes',
            'No'
        ]
    },
    {
        'id': 'stool_consistency',
        'type': 'single',
        'text': 'Stool consistency (Bristol Stool Chart):',
        'timeOfDay': 'Evening',
        'options': [
            'Type 1',
            'Type 2',
            'Type 3',
            'Type 4',
            'Type 5',
            'Type 6',
            'Type 7'
        ]
    },
    {
        'id': 'digestive_discomfort_today',
        'type': 'single',
        'text': 'Did you experience bloating, gas, or digestive discomfort today?',
        'timeOfDay': 'Evening',
        'options': [
            'None',
            'Mild',
            'Moderate',
            'Severe'
        ]
    },
    {
        'id': 'digestive_symptons_today',
        'type': 'single',
        'text': 'Did you experience any of the following additional digestive symptoms today? (Select all that apply)',
        'timeOfDay': 'Evening',
        'options': [
            '( ) No additional symptoms\n( ) Diarrhea (more than three loose or watery stools)\n( ) Constipation (hard, dry stools or skipped days)\n( ) Abdominal cramps or sharp pain\n( ) Nausea or queasiness\n( ) Heartburn or acid reflux\n( ) Excessive burping or upper GI gas\n( ) Sudden changes in appetite\n( ) Feeling unusually full after small meals\n( ) Fatigue or sluggishness after eating'
        ]
    },
  ],
  'Medication & Supplement Use': [
    {
        'id': 'medications_today',
        'type': 'single',
        'text': 'Did you take any medications today (including antibiotics)?',
        'timeOfDay': 'Anytime',
        'options': [
            'Yes',
            'No'
        ]
    },
  ],
  'Nutrition & Diet Habits': [
    {
        'id': 'water_drank_today',
        'type': 'number',
        'text': 'How much water did you drink today?',
        'timeOfDay': 'Evening',
        'placeholder': 'e.g., 2L'
    },
    {
        'id': 'fruit_veg_servings_today',
        'type': 'single',
        'text': 'How many servings of fruits and vegetables did you eat today?',
        'timeOfDay': 'Evening',
        'options': [
            '0\u20131',
            '2\u20133',
            '4\u20135',
            '6+'
        ]
    },
    {
        'id': 'fiber_intake_today',
        'type': 'single',
        'text': 'Approximate fiber intake today (grams): ____',
        'timeOfDay': 'Evening',
        'options': [
            'Any positive number (grams)'
        ]
    },
    {
        'id': 'fermented_foods_today',
        'type': 'single',
        'text': 'Did you consume fermented foods today?',
        'timeOfDay': 'Anytime',
        'options': [
            'Yes',
            'No'
        ]
    },
    {
        'id': 'processed_foods_today',
        'type': 'single',
        'text': 'Did you consume processed foods today?',
        'timeOfDay': 'Anytime',
        'options': [
            'Yes',
            'No'
        ]
    },
    {
        'id': 'calorie_intake_today',
        'type': 'single',
        'text': 'Approximate daily calorie intake: ____',
        'timeOfDay': 'Evening',
        'options': [
            'Any positive number'
        ]
    },
    {
        'id': 'avoided_trigger_foods_today',
        'type': 'single',
        'text': 'Did you avoid your known trigger foods today?',
        'timeOfDay': 'Anytime',
        'options': [
            'Yes',
            'No'
        ]
    },
    {
        'id': 'meals_today',
        'type': 'single',
        'text': 'How many meals did you have today?',
        'timeOfDay': 'Evening',
        'options': [
            '1',
            '2',
            '3',
            '4+'
        ]
    },
    {
        'id': 'alcohol_today',
        'type': 'single',
        'text': 'Did you consume any alcohol today?',
        'timeOfDay': 'Anytime',
        'options': [
            'Yes',
            'No'
        ]
    },
    {
        'id': 'caffeine_today',
        'type': 'single',
        'text': 'Did you consume caffeine today?',
        'timeOfDay': 'Anytime',
        'options': [
            'Yes',
            'No'
        ]
    },
    {
        'id': 'supplements_today',
        'type': 'single',
        'text': 'Did you take any supplements today?',
        'timeOfDay': 'Anytime',
        'options': [
            'Yes',
            'No'
        ]
    },
  ],
  'Personalized Goals & Achievements': [
    {
        'id': 'completed_gut_health_goals',
        'type': 'single',
        'text': 'Did you complete your daily gut-health goals today?',
        'timeOfDay': 'Evening',
        'options': [
            'Yes',
            'No'
        ]
    },
    {
        'id': 'participated_weekly_challenges',
        'type': 'single',
        'text': 'Did you participate in any weekly gut health challenges?',
        'timeOfDay': 'Anytime',
        'options': [
            'Yes',
            'No'
        ]
    },
    {
        'id': 'achieved_wellness_milestones',
        'type': 'single',
        'text': 'Did you achieve any new wellness milestones or rewards?',
        'timeOfDay': 'Evening',
        'options': [
            'Yes',
            'No'
        ]
    },
  ],
  'Physical Activity & Movement': [
    {
        'id': 'steps_today',
        'type': 'number',
        'text': 'How many steps did you take today?',
        'timeOfDay': 'Evening',
        'placeholder': 'e.g., 1'
    },
    {
        'id': 'exercise_duration_today',
        'type': 'single',
        'text': 'Total exercise duration (minutes): ____',
        'timeOfDay': 'Evening',
        'options': [
            'Any non\u2010negative number'
        ]
    },
    {
        'id': 'exercise_types_today',
        'type': 'single',
        'text': 'Type(s) of exercise you did today (select all that apply)',
        'timeOfDay': 'Evening',
        'options': [
            'Cardio',
            'Strength training',
            'Yoga or stretching',
            'Other (text)'
        ]
    },
    {
        'id': 'activity_level_today',
        'type': 'single',
        'text': 'Would you describe today\u2019s activity level as:',
        'timeOfDay': 'Evening',
        'options': [
            'Sedentary',
            'Moderate activity',
            'Vigorous activity'
        ]
    },
  ],
  'Stress, Sleep, and Recovery': [
    {
        'id': 'bedtime_last_night',
        'type': 'single',
        'text': 'What time did you go to bed last night?',
        'timeOfDay': 'Morning',
        'options': [
            'Any valid time'
        ]
    },
    {
        'id': 'time_to_fall_asleep',
        'type': 'single',
        'text': 'How long did it take you to fall asleep last night? (minutes)',
        'timeOfDay': 'Morning',
        'options': [
            'Any non\u2010negative number'
        ]
    },
    {
        'id': 'wake_up_time_today',
        'type': 'single',
        'text': 'What time did you wake up today?',
        'timeOfDay': 'Morning',
        'options': [
            'Any valid time'
        ]
    },
    {
        'id': 'total_sleep_hours',
        'type': 'single',
        'text': 'Total hours of sleep: ____',
        'timeOfDay': 'Morning',
        'options': [
            'Any positive number'
        ]
    },
    {
        'id': 'sleep_quality_rating',
        'type': 'single',
        'text': 'How would you rate your sleep quality?',
        'timeOfDay': 'Morning',
        'options': [
            'Poor',
            'Fair',
            'Good',
            'Excellent'
        ]
    },
    {
        'id': 'naps_or_rest_today',
        'type': 'single',
        'text': 'Did you take any naps or rest periods today?',
        'timeOfDay': 'Evening',
        'options': [
            'Yes',
            'No'
        ]
    },
    {
        'id': 'stress_level_today',
        'type': 'single',
        'text': 'How would you rate your stress level today?',
        'timeOfDay': 'Afternoon',
        'options': [
            'Low',
            'Moderate',
            'High',
            'Very High'
        ]
    },
    {
        'id': 'mindfulness_today',
        'type': 'single',
        'text': 'Did you engage in any mindfulness or meditation practices today?',
        'timeOfDay': 'Anytime',
        'options': [
            'Yes',
            'No'
        ]
    },
    {
        'id': 'breathing_or_relaxation_today',
        'type': 'single',
        'text': 'Did you do any breathing exercises or relaxation activities?',
        'timeOfDay': 'Anytime',
        'options': [
            'Yes',
            'No'
        ]
    },
    {
        'id': 'mood_today',
        'type': 'single',
        'text': 'How would you rate your mood today?',
        'timeOfDay': 'Afternoon',
        'options': [
            'Very Negative',
            'Negative',
            'Neutral',
            'Positive',
            'Very Positive'
        ]
    },
    {
        'id': 'work_life_balance_today',
        'type': 'single',
        'text': 'How would you rate your work\u2013life balance today?',
        'timeOfDay': 'Evening',
        'options': [
            'Very Poor',
            'Poor',
            'Fair',
            'Good',
            'Excellent'
        ]
    },
  ],
};