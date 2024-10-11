import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message?: string;
  jobId?: number;
  picks?: EditorPick[];
} | EditorPick | EditorPick[];

interface EditorPick {
  url: string;
}
export default async function addEditorPick(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  
    let data: any;
    if (typeof req.body === "string") {
      data = JSON.parse(req.body);
    } else {
      data = req.body;
    }

    const url = data.url;


    // Create a new editor's pick
    const newPick: EditorPick = {
      url: url,
    };
    
    // Respond with the new pick
    res.status(201).json(newPick);
  } 
