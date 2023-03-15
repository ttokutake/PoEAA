import { connect, serve, setCookie, getCookies } from "../deps.ts";

const port = 8080;

const redis = await connect({
  hostname: "redis",
  port: 6379,
});

const defaultSession = {
  name: "",
  bounty: "",
};

async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);

  let sessionId = getCookies(request.headers).sessionId;
  const headers = new Headers({ "content-type": "text/html; charset=utf-8" });
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    setCookie(headers, {name: "sessionId", value: sessionId});
  }

  let body;
  switch (url.pathname) {
    case '/next': {
      const name = url.searchParams.get("name") || "";
      const bounty = url.searchParams.get("bounty") || "";
      await redis.set(sessionId, JSON.stringify({name, bounty}));
      body = `
        <form action="/confirm">
          <div>
            <label for="role">Role</label>
            <select id="role" name="role" required>
              <option value="captain" selected>Captain</option>
              <option value="swordsman">Swordsman</option>
              <option value="navigator">Navigator</option>
              <option value="sniper">Sniper</option>
              <option value="cook">Cook</option>
            </select>
          </div>
          <input type="submit" value="Confirm" />
        </form>
      `;
      break;
    }
    case '/confirm': {
      const role = url.searchParams.get("role") || "captain";
      const sessionString = await redis.get(sessionId);
      const session = sessionString ? JSON.parse(sessionString) : defaultSession;
      body = `
        <form action="/complete">
          <div>
            <label for="name">Name</label>
            <input type="text" id="name" name="name" value="${session.name}" readonly />
          </div>
          <div>
            <label for="bounty">Bounty</label>
            <input type="number" id="bounty" name="bounty" value="${session.bounty}" readonly />
          </div>
          <div>
            <label for="role">Role</label>
            <select id="role" name="role" required>
              <option value="captain" ${role == "captain" ? "selected" : "disabled"}>Captain</option>
              <option value="swordsman" ${role == "swordsman" ? "selected" : "disabled"}>Swordsman</option>
              <option value="navigator" ${role == "navigator" ? "selected" : "disabled"}>Navigator</option>
              <option value="sniper" ${role == "sniper" ? "selected" : "disabled"}>Sniper</option>
              <option value="cook" ${role == "cook" ? "selected" : "disabled"}>Cook</option>
            </select>
          </div>
          <input type="submit" value="Submit" />
          <script>
            const nameInput = document.getElementById("name");
            const bountyInput = document.getElementById("bounty");
            if (!(nameInput.value && bountyInput.value)) {
              window.location.href = "/";
            }
          </script>
        </form>
      `;
      break;
    }
    case '/complete':
      await redis.del(sessionId);
      body = "<div>Submitted!</div>";
      break;
    default:
      body = `
        <form action="/next">
          <div>
            <label for="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Luffy" required />
          </div>
          <div>
            <label for="bounty">Bounty</label>
            <input type="number" id="bounty" name="bounty" min="0" placeholder="1500000000" required />
          </div>
          <input type="submit" value="Next" />
        </form>
      `;
  }

  const html = `
    <html>
      <head>
        <title>Server Session State</title>
      </head>
      <body>
        ${body}
      </body>
    </html>
  `;
  return new Response(html, {
    status: 200,
    headers,
  });
}

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(handler, { port });
