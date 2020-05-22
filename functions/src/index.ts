import { initializeApp, firestore } from "firebase-admin";
import { config } from "firebase-functions";
import { getInstallationToken } from "./github";
import axios from "axios";
import on from "./on";
import express from "express";
import semver from "semver";
initializeApp(config().firebase);
process.env["DEBUG"] = "express:*";
const app = express();
const db = firestore();


app.use(async(req, res, next) => {
    if(!process.env["APP_ID"])
    {
        const c = await db.collection("cluster").doc("config").get();
        process.env["APP_ID"] = c.get("AppID");
        process.env["PRIVATE_KEY"] = Buffer.from(c.get("Certificate"), 'base64').toString("utf8");
        process.env["INST_ID"] = c.get("InstallationID");
    }
    next();
});

app.post('/@me/hook', (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
});
app.get('/@me/container/github', async (req, res) => {
    const authKey = req.header("Authorization");
    if(!authKey)
    {
        res.sendStatus(401);
        return;
    }
    const credentials = await db.collection("cluster").doc("credentials").get();
    if(credentials.get("api") !== authKey)
    {
        return res.sendStatus(401);
        return;
    }

    // @ts-ignore
    const token = await getInstallationToken(+process.env["INST_ID"]);
    res.send(token);
    return;
});


app.get('/@me/version/latest', async (req, res) =>
{
    const result = await axios.get("https://api.github.com/repos/ancientproject/cli/releases/latest", { 
        headers: { 
            "User-Agent": "Ruler/1.0" 
        } 
    });

    const version = result.data.tag_name;

    res.send({
        version:{
            full: version,
            sem: semver.parse(version)
        },
        update_command: "yarn global add @rune/cli"
    });
});

const main = express();
main.use('/api', app);
exports.main = on(main);