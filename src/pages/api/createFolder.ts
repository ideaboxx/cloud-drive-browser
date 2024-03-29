import getGFS from "@/lib/gdrive";
import { assertNotEmpty, getToken } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function createDirectory(req: NextApiRequest, res: NextApiResponse) {
    const gfs = await getGFS(getToken(req, res));
    const { directoryId, directoryName } = req.body;
    try {
        //assertNotEmpty(directoryId, "Directory Id is empty");
        assertNotEmpty(directoryName, "Directory name is empty");
        const data = await gfs.createFolder(directoryName, directoryId);
        res.status(200).json(data);
    } catch (e) {
        res.status(400).json({
            message: e,
        });
    }
}
