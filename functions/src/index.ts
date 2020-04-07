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
    // @ts-ignore
    const token = await getInstallationToken(+process.env["INST_ID"]);
    res.send(token);
})
app.get('/ping', async (_, res) => {
    res.send("ПОНГ БЛЯТЬ");
});
app.get('/select/anus/svack', async (_, res) => {
    res.send("ПРУФ ЧТО СВАЦК ПИДОРАС");
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