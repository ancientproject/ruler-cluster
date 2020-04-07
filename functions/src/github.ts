import { request } from "@octokit/request";
import { createAppAuth } from "@octokit/auth-app";

export async function getInstallationToken(installationId: number): Promise<string> {
  if(!process.env.APP_ID)
    throw new Error();
  if(!process.env.PRIVATE_KEY)
    throw new Error();
  const result = await createAppAuth(
  {
    id: parseInt(process.env.APP_ID),
    privateKey: process.env.PRIVATE_KEY,
    installationId: installationId
  }
  )({ type: "installation" });
  return result.token;
}
export async function githubRequest(endpoint: string, installationId: number = 0) 
{
  if(!process.env.APP_ID)
    throw new Error();
  if(!process.env.PRIVATE_KEY)
    throw new Error();

  const auth = createAppAuth({
    id: +process.env.APP_ID,
    privateKey: process.env.PRIVATE_KEY
  });
  const authHeadersWithKey = request.defaults({
    request: { hook: auth.hook },
    mediaType: { previews: ["machine-man"] }
  });
  let data = "" as any;
  if (installationId !== 0)
  {
    const token = await getInstallationToken(installationId);
    data = await request(endpoint, {
      headers: {
        authorization: `token ${token}`,
        accept: "application/vnd.github.machine-man-preview+json"
      }
    });
  } 
  else 
    data = await authHeadersWithKey(endpoint, {});
  console.log(`Rate Limit Remaining: ${data.headers["x-ratelimit-remaining"]}/5000`);
  return data;
}