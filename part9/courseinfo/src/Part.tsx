import type { CoursePart } from "./types";

interface PartProps {
  part: CoursePart;
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({ part }: PartProps) => {
  switch (part.kind) {
    case "basic":
      return (
        <div>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
          <p>{part.description}</p>
        </div>
      );

    case "group":
      return (
        <div>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
          <p>group projects {part.groupProjectCount}</p>
        </div>
      );

    case "background":
      return (
        <div>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
          <p>{part.description}</p>
          <p>
            submit to{" "}
            <a href={part.backgroundMaterial}>
              {part.backgroundMaterial}
            </a>
          </p>
        </div>
      );

    case "special":
      return (
        <div>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
          <p>{part.description}</p>
          <p>required skills: {part.requirements.join(", ")}</p>
        </div>
      );

    default:
      return assertNever(part);
  }
};

export default Part;
