import pdfToText from "pdf-to-text";
import Resume from "../models/Resume.js";
import fs from "fs";
import ai from "../configs/ai.js";

export const enhanceProfSummary=async(req,res)=>{
    try{
        const {userContent}=req.body;
        if(!userContent){
            return res.status(400).json({message:"Content is required"});
        }
        const response=await ai.chat.completions.create({
            model:process.env.OPEN_AI_MODEL,
            messages:[
                {
                    role:"system",
                    content:"You are a expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience and career objectives. Make it compelling and ATS friendly . and only return text no options or anything else."
                },
                {
                    role:"user",
                    content:userContent
                },
            ]
        })
        const enhancedContent=response.choicees[0].message.content;
        return res.status(200).json({enhancedContent});
    }
    catch(error){
        return res.status(500).json({message:"Server Error",error:error.message});
    }
}

export const enhanceJobDescription=async(req,res)=>{
    try{
        const {userContent}=req.body;
        if(!userContent){
            return res.status(400).json({message:"Missing required fields"});
        }
        const response=await ai.chat.completions.create({
            model:process.env.OPEN_AI_MODEL,
            messages:[
                {
                    role:"system",
                    content:"You are a expert in resume writing. Your task is to enhance the job description of a resume. The description should be 1-2 sentences also highlighting key skills, experience and career objectives. Make it compelling and ATS friendly . and only return text no options or anything else."
                },
                {
                    role:"user",
                    content:userContent
                },
            ]
        })
        const enhancedContent=response.choicees[0].message.content;
        return res.status(200).json({enhancedContent});
    }
    catch(error){
        return res.status(500).json({message:"Server Error",error:error.message});
    }
}

export const uploadResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Resume PDF is required" });
    }

    // 🔹 Convert PDF → text (CALLBACK → PROMISE)
    const resumeText = await new Promise((resolve, reject) => {
      pdfToText.pdfToText(req.file.path, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ message: "Unable to read resume content" });
    }

    // 🔹 AI Extraction
    const response = await ai.chat.completions.create({
      model: process.env.OPEN_AI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Extract structured resume data and return ONLY valid JSON.",
        },
        {
          role: "user",
          content: `
Extract resume data into JSON format:

{
  "professional_summary": "",
  "skills": [],
  "personal_info": {
    "image": "",
    "full_name": "",
    "profession": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "experience": [],
  "project": [],
  "education": []
}

Resume:
${resumeText}
          `,
        },
      ],
      response_format: { type: "json_object" },
    });

    const parsedData = JSON.parse(response.choices[0].message.content);

    // 🔹 Save resume
    const newResume = await Resume.create({
      userId,
      title,
      ...parsedData,
    });

    // 🔹 Cleanup file
    fs.unlinkSync(req.file.path);

    res.status(201).json({ resumeId: newResume._id });
  } catch (error) {
    console.error("Upload Resume Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};