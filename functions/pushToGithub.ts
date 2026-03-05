import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { owner, repo, files } = await req.json();
    // files: array of { path: string, content: string }

    if (!owner || !repo || !files?.length) {
      return Response.json({ error: 'Missing owner, repo, or files' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection("github");

    const ghHeaders = {
      "Authorization": `Bearer ${accessToken}`,
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json"
    };

    const apiBase = `https://api.github.com/repos/${owner}/${repo}`;

    // Get current branch SHA
    const branchRes = await fetch(`${apiBase}/git/ref/heads/main`, { headers: ghHeaders });
    const branchData = await branchRes.json();

    let baseSha;
    if (branchRes.ok) {
      baseSha = branchData.object.sha;
    } else {
      // Repo might be empty - get default branch or init
      const repoRes = await fetch(`${apiBase}`, { headers: ghHeaders });
      const repoData = await repoRes.json();
      // Try to get any existing ref
      const refsRes = await fetch(`${apiBase}/git/refs`, { headers: ghHeaders });
      const refsData = await refsRes.json();
      if (refsData.length > 0) {
        baseSha = refsData[0].object.sha;
      }
    }

    // Create blobs for each file
    const blobs = await Promise.all(files.map(async (f) => {
      const blobRes = await fetch(`${apiBase}/git/blobs`, {
        method: "POST",
        headers: ghHeaders,
        body: JSON.stringify({ content: f.content, encoding: "utf-8" })
      });
      const blobData = await blobRes.json();
      return { path: f.path, mode: "100644", type: "blob", sha: blobData.sha };
    }));

    // Create tree
    const treeBody = { tree: blobs };
    if (baseSha) {
      // Get current commit to get its tree sha
      const commitRes = await fetch(`${apiBase}/git/commits/${baseSha}`, { headers: ghHeaders });
      const commitData = await commitRes.json();
      treeBody.base_tree = commitData.tree.sha;
    }

    const treeRes = await fetch(`${apiBase}/git/trees`, {
      method: "POST",
      headers: ghHeaders,
      body: JSON.stringify(treeBody)
    });
    const treeData = await treeRes.json();

    // Create commit
    const commitBody = {
      message: "chore: update Flutter app from WebApp Converter AI",
      tree: treeData.sha,
    };
    if (baseSha) commitBody.parents = [baseSha];

    const newCommitRes = await fetch(`${apiBase}/git/commits`, {
      method: "POST",
      headers: ghHeaders,
      body: JSON.stringify(commitBody)
    });
    const newCommitData = await newCommitRes.json();

    // Update or create the main branch ref
    if (baseSha) {
      await fetch(`${apiBase}/git/refs/heads/main`, {
        method: "PATCH",
        headers: ghHeaders,
        body: JSON.stringify({ sha: newCommitData.sha, force: true })
      });
    } else {
      await fetch(`${apiBase}/git/refs`, {
        method: "POST",
        headers: ghHeaders,
        body: JSON.stringify({ ref: "refs/heads/main", sha: newCommitData.sha })
      });
    }

    return Response.json({ success: true, commitSha: newCommitData.sha });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});