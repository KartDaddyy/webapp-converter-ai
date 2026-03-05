import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, buildId, appId, workflowId, projectName, flutterCode } = await req.json();
    const token = Deno.env.get("CODEMAGIC_API_TOKEN");

    if (!token) {
      return Response.json({ error: 'CODEMAGIC_API_TOKEN not set' }, { status: 500 });
    }

    const headers = {
      "x-auth-token": token,
      "Content-Type": "application/json"
    };

    // Get build status
    if (action === "status" && buildId) {
      const res = await fetch(`https://api.codemagic.io/builds/${buildId}`, { headers });
      const data = await res.json();
      return Response.json(data);
    }

    // List apps
    if (action === "listApps") {
      const res = await fetch("https://api.codemagic.io/apps", { headers });
      const data = await res.json();
      return Response.json(data);
    }

    // Trigger a build
    if (action === "triggerBuild" && appId && workflowId) {
      const body = {
        appId,
        workflowId,
        branch: "main"
      };
      const res = await fetch("https://api.codemagic.io/builds", {
        method: "POST",
        headers,
        body: JSON.stringify(body)
      });
      const data = await res.json();
      return Response.json(data);
    }

    return Response.json({ error: 'Invalid action or missing params' }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});