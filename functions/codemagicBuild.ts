import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, buildId, appId, workflowId, artifactUrl } = body;
    const token = Deno.env.get("CODEMAGIC_API_TOKEN");

    if (!token) {
      return Response.json({ error: 'CODEMAGIC_API_TOKEN not set' }, { status: 500 });
    }

    const headers = {
      "x-auth-token": token,
      "Content-Type": "application/json"
    };

    // List apps
    if (action === "listApps") {
      const res = await fetch("https://api.codemagic.io/apps", { headers });
      const data = await res.json();
      return Response.json(data);
    }

    // Trigger a build
    if (action === "triggerBuild" && appId && workflowId) {
      const res = await fetch("https://api.codemagic.io/builds", {
        method: "POST",
        headers,
        body: JSON.stringify({ appId, workflowId, branch: "main" })
      });
      const data = await res.json();
      return Response.json(data);
    }

    // Get build status + artifacts
    if (action === "status" && buildId) {
      const res = await fetch(`https://api.codemagic.io/builds/${buildId}`, { headers });
      const data = await res.json();
      return Response.json(data);
    }

    // Create public download URL for an artifact
    if (action === "publicUrl" && artifactUrl) {
      // artifactUrl is like: https://api.codemagic.io/artifacts/xxx/yyy/app.apk
      const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24h
      const res = await fetch(`${artifactUrl}/public-url`, {
        method: "POST",
        headers,
        body: JSON.stringify({ expiresAt })
      });
      const data = await res.json();
      return Response.json(data);
    }

    return Response.json({ error: 'Invalid action or missing params' }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});