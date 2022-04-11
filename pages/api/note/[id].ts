import { prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Note>) {
    const noteId = req.query.id;

    if (req.method === 'DELETE') {
        const note = await prisma.note.delete({
            where: {id: Number(noteId)}
        });
        res.json(note);
    } else {
        console.log("Method Not Allowed");
        res.status(405); // The request method is known by the server but is not supported by the target resource.
    }
}

type Note = {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    upDatedAt: Date;
  }