// app/components/ProfessorMessage.tsx
import React from "react";

// Define the types for the props this component expects
interface ProfessorMessageProps {
  message: string;
  professorName?: string; // Optional prop
}

const ProfessorMessage: React.FC<ProfessorMessageProps> = ({
  message,
  professorName = "Professor Oak",
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-lg shadow-md mb-8 flex items-center space-x-4">
      <img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/271.png"
        alt={`${professorName} Icon`}
        className="w-16 h-16 rounded-full border-2 border-blue-400"
      />
      <div>
        <h2 className="text-xl font-semibold text-blue-800">
          Nachricht von {professorName}:
        </h2>
        <p className="text-gray-700 mt-1">"{message}"</p>
      </div>
    </div>
  );
};

export default ProfessorMessage;
