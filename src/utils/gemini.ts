import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI("AIzaSyCy-k3nWQf_tDFHjLwN9BiSERmg4PkiSjA");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function fileToGenerativePart(path: string, mimeType: string) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

const prompt = `Take the image I sent and write the perfect quote to publish it with. 
Respond **only** with valid JSON in this exact format:
{"quote":"PUT QUOTE HERE"}
Do not include triple backticks, newlines, or any extra characters.`;

export async function generateContent(imagePath: string, mimeType: string) {
  try {
    const imagePart = fileToGenerativePart(
        path.join(__dirname, '../../uploads', path.basename(imagePath)),
        mimeType
    );
    let result = (await model.generateContent([prompt, imagePart])).response.text();

    // Remove the JSON code block if it exists
    if(result.match(/```json\n([\s\S]*?)\n```/)){
      result = result.replace(/```json\n?|\n?```/g, "").trim();
    }

    return JSON.parse(result);
  } catch (error) {
    console.error("Error generating content:", error);
  }
}