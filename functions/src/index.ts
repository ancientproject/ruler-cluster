import { getDB } from "./Firestore";
import { getInstallationToken } from "./github";
import on from "./on";
import express from "express";
const app = express();

app.post('/@me/hook', (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
});
app.get('/@me/container/github', async (req, res) => {
    const authKey = req.header("Authorization");
    if(!authKey)
        return res.sendStatus(401);
    const credentials = await getDB().collection("cluster").doc("credentials").get();
    if(credentials.get("api") !== authKey)
        return res.sendStatus(401);

    // @ts-ignore
    const token = await getInstallationToken(+process.env["INST_ID"]);
    return res.send(token);
});

const main = express();

(async() => {
    const config = await getDB().collection("cluster").doc("config").get();
    
    process.env["APP_ID"] = config.get("AppID");
    process.env["PRIVATE_KEY"] = Buffer.from(config.get("Certificate"), 'base64').toString("utf8");
    process.env["INST_ID"] = config.get("InstallationID");
    main.use('/api', app);
})();





exports.main = on(main);