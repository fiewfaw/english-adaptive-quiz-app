const fs = require("fs");
const https = require("https");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_OWNER = "fiewfaw";
const DEFAULT_REPO = "english-adaptive-quiz-app";
const DEFAULT_BRANCH = "main";
const DEFAULT_PAGES_URL = "https://fiewfaw.github.io/english-adaptive-quiz-app/questions.js";
const CONTENT_FILE = "questions.js";

function parseArgs(argv) {
  const args = {
    dryRun: false,
    skipLiveCheck: false,
    help: false,
  };

  argv.forEach((arg) => {
    if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--skip-live-check") args.skipLiveCheck = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
    else throw new Error(`Unknown option: ${arg}`);
  });

  return args;
}

function encodeBase64(text) {
  return Buffer.from(text, "utf8").toString("base64");
}

function encodeRepoPath(repoPath) {
  return repoPath.split("/").map(encodeURIComponent).join("/");
}

function buildContentPath(owner, repo, repoPath, branch) {
  return `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodeRepoPath(repoPath)}?ref=${encodeURIComponent(branch)}`;
}

function buildContentWritePath(owner, repo, repoPath) {
  return `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodeRepoPath(repoPath)}`;
}

function createPublishMessage(repoPath) {
  return `Update quiz content: ${repoPath}`;
}

function normalizeContent(text) {
  return text.replace(/\r\n/g, "\n").trim();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function printUsage() {
  console.log("Usage: node scripts/publish-content.js [--dry-run] [--skip-live-check]");
  console.log("");
  console.log("Environment:");
  console.log("  GITHUB_TOKEN   Required for real publish. Do not commit or print it.");
  console.log("  GITHUB_OWNER   Optional, default: fiewfaw");
  console.log("  GITHUB_REPO    Optional, default: english-adaptive-quiz-app");
  console.log("  GITHUB_BRANCH  Optional, default: main");
}

function runValidation() {
  const validator = path.join(ROOT, "scripts", "validate-questions.js");
  const result = spawnSync(process.execPath, [validator], {
    cwd: ROOT,
    encoding: "utf8",
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) {
    throw new Error("Question validation failed. Fix questions.js before publishing.");
  }
}

function requestRaw({ hostname, requestPath, method, token, body, headers = {} }) {
  const requestHeaders = {
    "User-Agent": "english-adaptive-quiz-publisher",
    Accept: "application/vnd.github+json",
    ...headers,
  };

  if (token) requestHeaders.Authorization = `Bearer ${token}`;
  if (body) {
    requestHeaders["Content-Type"] = "application/json";
    requestHeaders["Content-Length"] = Buffer.byteLength(body);
  }

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname,
        path: requestPath,
        method,
        headers: requestHeaders,
      },
      (res) => {
        let responseBody = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          responseBody += chunk;
        });
        res.on("end", () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: responseBody,
          });
        });
      }
    );

    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function requestJson(method, apiPath, token, body) {
  const response = await requestRaw({
    hostname: "api.github.com",
    requestPath: apiPath,
    method,
    token,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  let parsed = {};
  if (response.body) {
    try {
      parsed = JSON.parse(response.body);
    } catch (error) {
      const parseError = new Error(`GitHub API returned non-JSON response (${response.status})`);
      parseError.status = response.status;
      throw parseError;
    }
  }

  if (response.status < 200 || response.status >= 300) {
    const message = parsed.message || "request failed";
    const error = new Error(`GitHub API ${response.status}: ${message}`);
    error.status = response.status;
    throw error;
  }

  return parsed;
}

async function requestText(url, redirectsLeft = 3) {
  const parsed = new URL(url);
  const response = await requestRaw({
    hostname: parsed.hostname,
    requestPath: `${parsed.pathname}${parsed.search}`,
    method: "GET",
    headers: {
      Accept: "text/plain,*/*",
      "Cache-Control": "no-cache",
    },
  });

  if ([301, 302, 303, 307, 308].includes(response.status) && response.headers.location && redirectsLeft > 0) {
    const nextUrl = new URL(response.headers.location, url).toString();
    return requestText(nextUrl, redirectsLeft - 1);
  }

  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Live check HTTP ${response.status}`);
  }

  return response.body;
}

async function getCurrentSha({ owner, repo, branch, repoPath, token }) {
  try {
    const current = await requestJson("GET", buildContentPath(owner, repo, repoPath, branch), token);
    return current.sha;
  } catch (error) {
    if (error.status === 404) return undefined;
    throw error;
  }
}

async function publishFile({ owner, repo, branch, repoPath, localPath, token }) {
  const content = fs.readFileSync(localPath, "utf8");
  const sha = await getCurrentSha({ owner, repo, branch, repoPath, token });
  const payload = {
    message: createPublishMessage(repoPath),
    content: encodeBase64(content),
    branch,
  };

  if (sha) payload.sha = sha;

  const result = await requestJson("PUT", buildContentWritePath(owner, repo, repoPath), token, payload);
  return {
    commitSha: result.commit && result.commit.sha ? result.commit.sha : "unknown",
    content,
  };
}

async function waitForLiveMatch({ liveUrl, expectedContent, attempts = 24, delayMs = 5000 }) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const cacheBust = new URL(liveUrl);
      cacheBust.searchParams.set("publish_check", `${Date.now()}-${attempt}`);
      const liveContent = await requestText(cacheBust.toString());
      if (normalizeContent(liveContent) === normalizeContent(expectedContent)) {
        return;
      }
      lastError = new Error("live content does not match local questions.js yet");
    } catch (error) {
      lastError = error;
    }

    if (attempt < attempts) {
      console.log(`WAIT: GitHub Pages update not visible yet (${attempt}/${attempts})`);
      await sleep(delayMs);
    }
  }

  throw new Error(`Published, but live verification did not pass: ${lastError.message}`);
}

async function main(argv = process.argv.slice(2), env = process.env) {
  const args = parseArgs(argv);
  if (args.help) {
    printUsage();
    return;
  }

  const owner = env.GITHUB_OWNER || DEFAULT_OWNER;
  const repo = env.GITHUB_REPO || DEFAULT_REPO;
  const branch = env.GITHUB_BRANCH || DEFAULT_BRANCH;
  const liveUrl = env.PAGES_QUESTIONS_URL || DEFAULT_PAGES_URL;
  const localPath = path.join(ROOT, CONTENT_FILE);

  if (!fs.existsSync(localPath)) {
    throw new Error(`${CONTENT_FILE} was not found at repo root`);
  }

  runValidation();

  if (args.dryRun) {
    console.log("DRY_RUN_OK: validation passed; no upload attempted");
    return;
  }

  const token = env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("Missing GITHUB_TOKEN. Add a fine-grained GitHub token to the Ann/Hermes environment.");
  }

  const result = await publishFile({
    owner,
    repo,
    branch,
    repoPath: CONTENT_FILE,
    localPath,
    token,
  });

  console.log(`PUBLISH_OK: ${CONTENT_FILE} commit=${result.commitSha}`);

  if (!args.skipLiveCheck) {
    await waitForLiveMatch({
      liveUrl,
      expectedContent: result.content,
    });
    console.log(`LIVE_OK: ${liveUrl}`);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`FAIL: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  parseArgs,
  encodeBase64,
  buildContentPath,
  createPublishMessage,
  normalizeContent,
  main,
};
