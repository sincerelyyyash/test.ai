"use server";

import { generateQuestions } from "@/lib/gemini";
import Test from "@/models/Test";
import dbConnect from "@/lib/dbConnect";

export async function createTest(testDetails) {
  try {
    await dbConnect();

    const questions = await generateQuestions(testDetails);

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Invalid questions generated");
    }

    const newTest = new Test({
      ...testDetails,
      questions: questions,
    });

    await newTest.save();

    return { success: true, testId: newTest._id.toString() };
  } catch (error) {
    console.error("Error creating test:", error);
    return { success: false, error: error.message };
  }
}

export async function getTestById(testId) {
  try {
    await dbConnect();
    const test = await Test.findById(testId);
    if (!test) {
      return null;
    }

    return JSON.parse(JSON.stringify(test));
  } catch (error) {
    console.error("Error fetching test:", error);
    return null;
  }
}