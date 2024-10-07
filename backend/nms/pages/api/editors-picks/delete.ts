import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message?: string;
};

export default async function deleteEditorPick(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    res.status(200).json({ message: "Editor’s pick deleted successfully." });
  } 
