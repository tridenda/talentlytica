"use client";

import { useState, useMemo, useCallback } from "react";

// Define types
interface Student {
  id: number;
  name: string;
}

interface Aspect {
  id: number;
  name: string;
}

type GradesState = {
  [key: string]: number | "";
};

interface FormattedOutput {
  [aspectKey: string]: {
    [studentKey: string]: number;
  };
}

export default function StudentGradingApp() {
  // Daftar 10 mahasiswa
  const students: Student[] = useMemo(
    () => [
      { id: 1, name: "Mahasiswa 1" },
      { id: 2, name: "Mahasiswa 2" },
      { id: 3, name: "Mahasiswa 3" },
      { id: 4, name: "Mahasiswa 4" },
      { id: 5, name: "Mahasiswa 5" },
      { id: 6, name: "Mahasiswa 6" },
      { id: 7, name: "Mahasiswa 7" },
      { id: 8, name: "Mahasiswa 8" },
      { id: 9, name: "Mahasiswa 9" },
      { id: 10, name: "Mahasiswa 10" },
    ],
    []
  );

  // Aspek penilaian
  const aspects: Aspect[] = useMemo(
    () => [
      { id: 1, name: "Aspek Penilaian 1" },
      { id: 2, name: "Aspek Penilaian 2" },
      { id: 3, name: "Aspek Penilaian 3" },
      { id: 4, name: "Aspek Penilaian 4" },
    ],
    []
  );

  // State untuk menyimpan nilai
  const [grades, setGrades] = useState<GradesState>({});
  const [jsonOutput, setJsonOutput] = useState<FormattedOutput | null>(null);

  // Fungsi untuk update nilai dengan useCallback untuk mencegah render berlebih
  const updateGrade = useCallback(
    (studentId: number, aspectId: number, value: string): void => {
      setGrades((prevGrades) => ({
        ...prevGrades,
        [`${studentId}-${aspectId}`]: value === "" ? "" : parseInt(value, 10),
      }));
    },
    []
  );

  // Fungsi untuk mendapatkan nilai
  const getGrade = useCallback(
    (studentId: number, aspectId: number): number | "" => {
      return grades[`${studentId}-${aspectId}`] || "";
    },
    [grades]
  );

  // Handler untuk tombol Simpan
  const handleSave = useCallback((): void => {
    // Format data sesuai dengan format yang diminta
    const formattedData: FormattedOutput = {};

    aspects.forEach((aspect) => {
      const aspectKey: string = aspect.name.toLowerCase().replace(/ /g, "_");
      formattedData[aspectKey] = {};

      students.forEach((student) => {
        const grade = getGrade(student.id, aspect.id);
        if (grade !== "") {
          const studentKey: string = student.name
            .toLowerCase()
            .replace(/ /g, "_");
          formattedData[aspectKey][studentKey] = grade as number;
        }
      });
    });

    setJsonOutput(formattedData);
  }, [aspects, students, getGrade]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Sistem Penilaian Mahasiswa
      </h1>

      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Nama Mahasiswa</th>
              {aspects.map((aspect) => (
                <th key={aspect.id} className="py-2 px-4 border">
                  {aspect.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="py-2 px-4 border font-medium">{student.name}</td>
                {aspects.map((aspect) => (
                  <td key={aspect.id} className="py-2 px-4 border">
                    <select
                      value={getGrade(student.id, aspect.id).toString()}
                      onChange={(e) =>
                        updateGrade(student.id, aspect.id, e.target.value)
                      }
                      className="w-full p-1 border rounded"
                    >
                      <option defaultValue={0}>0</option>
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Simpan
        </button>
      </div>

      {jsonOutput && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Output JSON:</h2>
          <div className="bg-gray-800 text-green-400 p-4 rounded overflow-auto">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(jsonOutput, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
