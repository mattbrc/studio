export const programReferences = {
  "hybrid": {
    sample: `
{
  "workouts": [
    {
      "orderId": 1,
      "title": "Monday: Push 1",
      "strength": {
        "a": "Bodyweight Dips: 2x8-15 (light weight, warm-up, not to failure)",
        "b": "Chest Press: 1x6-9, 1x12-15",
        "c": "Standing BB Shoulder Press: 1x6-9, 1x12-15",
        "d": "Cable Tri Pushdown + Lateral Raises: 1x12-15, 1x15-20",
        "e": "DB Tri Kickbacks + Front Delt Raises: 2x15-20",
        "f": "Tricep Cluster: 4x6 Cable Tricep Extensions (straight bar)"
      },
      "conditioning": {
        "a": "45-60 min Z2 effort: run/bike/hike/row/swim"
      }
    }
  ]
}`,
  },

  "vo2-max-hrv": {
    sample: `
{
  "workouts": [
    {
      "orderId": 1,
      "title": "Monday: VO2 Max Development",
      "strength": {
        "a": "Light Circuit: 3 rounds - 10 push-ups, 10 pull-ups, 20 air squats"
      },
      "conditioning": {
        "a": "8x400m intervals at 90% effort with 1:1 work:rest ratio",
        "b": "20 min Z2 cooldown"
      }
    }
  ]
}`,
  },

  "speed": {
    sample: `
{
  "workouts": [
    {
      "orderId": 1,
      "title": "Monday: Speed Development",
      "strength": {
        "a": "Box Jumps: 4x5 (explosive)",
        "b": "Power Cleans: 5x3",
        "c": "Split Squats: 3x8 each leg"
      },
      "conditioning": {
        "a": "6x200m sprints at 90% with full recovery",
        "b": "4x100m acceleration drills"
      }
    }
  ]
}`,
  },

  "strength": {
    sample: `
{
  "workouts": [
    {
      "orderId": 1,
      "title": "Monday: Heavy Lower",
      "strength": {
        "a": "Back Squat: 5x5 @ 80-85%",
        "b": "Romanian Deadlift: 4x8",
        "c": "Front Squat: 3x8",
        "d": "Bulgarian Split Squat: 3x10 each"
      },
      "conditioning": {
        "a": "None"
      }
    }
  ]
}`,
  },

  "marathon": {
    sample: `
{
  "workouts": [
    {
      "orderId": 1,
      "title": "Monday: Endurance Base",
      "strength": {
        "a": "Bodyweight Circuit: 2 rounds of 15 each movement",
        "b": "Core Work: 3x1 minute planks"
      },
      "conditioning": {
        "a": "90 min Zone 2 run",
        "b": "10 min mobility work"
      }
    }
  ]
}`,
  },

  "milprep": {
    sample: `
{
  "workouts": [
    {
      "orderId": 1,
      "title": "Monday: Rucking + Strength",
      "strength": {
        "a": "Weighted Pull-ups: 5x5",
        "b": "Push-ups: 5x20",
        "c": "Squats: 5x10 with ruck"
      },
      "conditioning": {
        "a": "45lb Ruck: 6 miles in 90 min or less",
        "b": "400m runs x5 with ruck"
      }
    }
  ]
}`,
  },

  "acft": {
    sample: `
{
  "workouts": [
    {
      "orderId": 1,
      "title": "Monday: ACFT Focus",
      "strength": {
        "a": "Hex Bar Deadlift: 5x3 @ 80%",
        "b": "Hand Release Push-ups: 4x20",
        "c": "Power Throws: 5x5"
      },
      "conditioning": {
        "a": "Sprint-Drag-Carry practice: 3 rounds",
        "b": "2 mile run time trial"
      }
    }
  ]
}`,
  },

  "maintenance": {
    sample: `
{
  "workouts": [
    {
      "orderId": 1,
      "title": "Monday: Maintenance",
      "strength": {
        "a": "Bodyweight Circuit: 2 rounds of 15 each movement",
        "b": "Core Work: 3x1 minute planks"
      },
      "conditioning": {
        "a": "90 min Zone 2 run",
        "b": "10 min mobility work"
      }
    }
  ]
}`,
  },
} as const;

export type ProgramType = keyof typeof programReferences;
