import getGFS from "@/lib/gdrive";
import { assertNotEmpty, getToken } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function downloadFile(req: NextApiRequest, res: NextApiResponse) {
    try {
        const gfs = await getGFS(getToken(req, res));
        assertNotEmpty(req.query.id, "File id can't be empty!");
        const result = await gfs.download(req.query.id as string);
        if (result) {
            const headers = {
                "Content-Length": result.length,
                "Content-Disposition": `attachment; filename="${result.name}"`,
                Connection: "keep-alive",
                "Keep-Alive": "timeout=5",
            };
            res.writeHead(200, headers);
            result.data.pipe(res);
        } else {
            throw "File with given id not found";
        }
    } catch (e) {
        res.status(400).json({
            message: e,
        });
    }
}
