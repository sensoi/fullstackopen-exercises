interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (
  dailyHours: number[],
  target: number
): ExerciseResult => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter(h => h > 0).length;
  const totalHours = dailyHours.reduce((a, b) => a + b, 0);
  const average = totalHours / periodLength;

  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = "excellent, target achieved";
  } else if (average >= target * 0.75) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  } else {
    rating = 1;
    ratingDescription = "you need to train more";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

const args = process.argv.slice(2);

if (args.length < 2) {
  throw new Error("Not enough arguments");
}

const target = Number(args[0]);
const dailyHours = args.slice(1).map(Number);

if (isNaN(target) || dailyHours.some(isNaN)) {
  throw new Error("Provided values were not numbers");
}

console.log(calculateExercises(dailyHours, target));

export { calculateExercises };
