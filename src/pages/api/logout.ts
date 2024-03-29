import Cookies from "cookies";
import { NextApiRequest, NextApiResponse } from "next";

export default async function logout(req: NextApiRequest, res: NextApiResponse) {
    const cookies = new Cookies(req, res);
    const uuid = cookies.get("token");
    if (uuid) {
        global.session.delete(uuid);
    }
    cookies.set("token", null);
    res.redirect("/");
}
