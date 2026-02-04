const calculateBmi = (heightCm: number, weightKg: number): string => {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal range";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    throw new Error("Please provide height and weight");
  }

  const height = Number(args[0]);
  const weight = Number(args[1]);

  if (isNaN(height) || isNaN(weight)) {
    throw new Error("Provided values were not numbers");
  }

  console.log(calculateBmi(height, weight));
}

export { calculateBmi };
