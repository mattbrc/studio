const strength = {
  strength1: {
    "a": "Hamstring Curls (LIGHT): 1x15-20",
    "b": "DB Lunges: 1x6-9, 1x12-15 OR Back Squats: 2x5 pause (alternate each week)",
    "c": "Single Leg DB RDLs (arm assist as needed): 1x6-9, 1x12-15",
    "d": "Tibialis Raises: 2x15-20",
    "e": "Anti-Rotation Pallof Press: 2x10-15",
    "f": "DB/Machine Shoulder Press: 2x12-15",
    "g": "Rack Pulls: 3x8-15",
    "h": "Strict CG Pushups: 2-3x20-30 OR Incline DB Bench: 2x10-15",
    "i": "DB/Machine Preacher Curls: 2x8-12",
    "j": "Overhead DB Extension: 2x12-15"
  },
  strength2: {
    "a": "Broad Jumps: 3x5 (focus on explosiveness)",
    "b": "KB Swings: 3x10-15, focus on hip hinge explosion, not using arms",
    "c": "Bulgarian Split Squats: 1x6-9, 1x12-15",
    "d": "Elevated Heel Calf Raises: 2x15-20",
    "e": "Strict CG Pushups: 2-3x20-30 OR Incline DB Bench: 2x10-15",
    "f": "DB/Machine Lateral Raises: 2x12-15",
    "g": "Bent over supported SA DB Rows: 2x12-15",
    "h": "Seated Incline DB Curls: 2x12-15",
    "i": "Tri Cable Ext: 2x12-15"
  },
  rest: {
    "a": "Rest"
  }

};

const conditioning = {
  easy: {
    "a": "3-5 miles @ easy pace"
  },
  optional: {
    "a": "Optional: 3-5 mile run @ easy pace"
  },
  tempo1: {
    "a": "1 mile up",
    "b": "3-5 miles @ tempo pace",
    "c": "1 mile down"
  },
  tempo2: {
    "a": "1 mile up",
    "b": "5 Rounds:",
    "c": "60 sec @ 5k pace",
    "d": "120 sec recovery jog",
    "e": "1 mile down"
  },
  tempo3: {
    "a": "1 mile up",
    "b": "8 min @ HMP",
    "c": "2 min easy",
    "d": "8 min @ 10k",
    "e": "2 min easy",
    "f": "8 min @ 5k",
    "g": "1 mile down"
  },
  tempo4: {
    "a": "1 mile up",
    "b": "15 min @ tempo + 3 min rest",
    "c": "10x1 min hill repeats @ 75% effort",
    "d": "1 mile down"
  },
  recovery: {
    "a": "Very easy walk/jog 2-4 miles"
  },
  intervals1: {
    "a": "1 mile up",
    "b": "4 Rounds:",
    "c": "400m @ 5k pace",
    "d": "rest 90-120 sec",
    "e": "1 mile down"
  },
  intervals2: {
    "a": "1 mile up",
    "b": "3 Rounds:",
    "c": "800m @ 5k pace",
    "d": "rest 90 sec",
    "e": "400m @ mile pace",
    "f": "rest 3 min between rounds",
    "g": "1 mile down"
  },
  intervals3: {
    "a": "1 mile up",
    "b": "2 Rounds:",
    "c": "1km @ 5k pace",
    "d": "rest 3-4 min",
    "e": "1 mile down"
  },
  longRun1: {
    "a": "6-8 miles @ conversational pace",
  },
  longRun2: {
    "a": "8-10 miles @ conversational pace",
    "h": "about 4.5 miles total"
  },
  longRun3: {
    "a": "12-14 miles @ conversational pace"
  },
  rest: {
    "a": "Rest"
  }
}

export const data = [
  // --- Week 1 ---
  {
    "title": "Monday: Strength",
    "strength": strength.strength1,
    "conditioning": conditioning.rest,
    "programId": 69
  },
  {
    "title": "Tuesday: Conditioning",
    "strength": strength.rest,
    "conditioning": conditioning.easy,
    "programId": 69
  },
  {
    "title": "Wednesday: Shakeout Run",
    "strength": strength.rest,
    "conditioning": conditioning.recovery,
    "programId": 69
  },
  {
    "title": "Strength Thursday",
    "strength": strength.strength2,
    "conditioning": conditioning.optional,
    "programId": 69
  },
  {
    "title": "Friday: Conditioning",
    "strength": strength.rest,
    "conditioning": conditioning.easy,
    "programId": 69
  },
  {
    "title": "Saturday: Long Run",
    "strength": strength.rest,
    "conditioning": conditioning.longRun1,
    "programId": 69
  },
  {
    "title": "Sunday: Rest",
    "strength": strength.rest,
    "conditioning": conditioning.rest,
    "programId": 69
  },
  // --- Week 2 ---
  {
    "title": "Monday: Strength",
    "strength": strength.strength1,
    "conditioning": conditioning.rest,
    "programId": 69
  },
  {
    "title": "Tuesday: Conditioning",
    "strength": strength.rest,
    "conditioning": conditioning.tempo1,
    "programId": 69
  },
  {
    "title": "Wednesday: Shakeout Run",
    "strength": strength.rest,
    "conditioning": conditioning.recovery,
    "programId": 69
  },
  {
    "title": "Strength Thursday",
    "strength": strength.strength2,
    "conditioning": conditioning.optional,
    "programId": 69
  },
  {
    "title": "Friday: Conditioning",
    "strength": strength.rest,
    "conditioning": conditioning.easy,
    "programId": 69
  },
  {
    "title": "Saturday: Long Run",
    "strength": strength.rest,
    "conditioning": conditioning.longRun1,
    "programId": 69
  },
  {
    "title": "Sunday: Rest",
    "strength": strength.rest,
    "conditioning": conditioning.rest,
    "programId": 69
  },
  // --- Week 3 ---
  {
    "title": "Monday: Strength",
    "strength": strength.strength1,
    "conditioning": conditioning.rest,
    "programId": 69
  },
  {
    "title": "Tuesday: Conditioning",
    "strength": strength.rest,
    "conditioning": conditioning.tempo4,
    "programId": 69
  },
  {
    "title": "Wednesday: Shakeout Run",
    "strength": strength.rest,
    "conditioning": conditioning.recovery,
    "programId": 69
  },
  {
    "title": "Strength Thursday",
    "strength": strength.strength2,
    "conditioning": conditioning.optional,
    "programId": 69
  },
  {
    "title": "Friday: Conditioning",
    "strength": strength.rest,
    "conditioning": conditioning.intervals2,
    "programId": 69
  },
  {
    "title": "Saturday: Long Run",
    "strength": strength.rest,
    "conditioning": conditioning.longRun1,
    "programId": 69
  },
  {
    "title": "Sunday: Rest",
    "strength": strength.rest,
    "conditioning": conditioning.rest,
    "programId": 69
  },
  // --- Week 4 ---
  {
    "title": "Monday: Strength",
    "strength": strength.strength1,
    "conditioning": conditioning.rest,
    "programId": 69
  },
  {
    "title": "Tuesday: Conditioning",
    "strength": strength.rest,
    "conditioning": conditioning.tempo3,
    "programId": 69
  },
  {
    "title": "Wednesday: Shakeout Run",
    "strength": strength.rest,
    "conditioning": conditioning.recovery,
    "programId": 69
  },
  {
    "title": "Strength Thursday",
    "strength": strength.strength2,
    "conditioning": conditioning.optional,
    "programId": 69
  },
  {
    "title": "Friday: Conditioning",
    "strength": strength.rest,
    "conditioning": conditioning.intervals3,
    "programId": 69
  },
  {
    "title": "Saturday: Long Run",
    "strength": strength.rest,
    "conditioning": conditioning.longRun2,
    "programId": 69
  },
  {
    "title": "Sunday: Rest",
    "strength": strength.rest,
    "conditioning": conditioning.rest,
    "programId": 69
  },
];
