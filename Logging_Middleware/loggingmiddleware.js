const fetch = require('node-fetch');

const validpackages = {
    frontend:["api","component","hook","page","state","style"],
    backend:["cache","controller","cron_job","db","domain","handler","repository","route","service"],
    common:["auth","config","middleware","utils"]
}

function isvalid(stack, package) {
  if (validpackages.common.includes(package)) return true;
  return validpackages[stack]?.includes(package) || false;
}

async function log(stack, level, package, message) {
  const url = "http://20.244.56.144/evaluation-service/logs";

  if (!["backend", "frontend"].includes(stack)) {
    console.error(`Invalid stack: '${stack}'`);
    return;
  }

  if (!["debug", "info", "warn", "error", "fatal"].includes(level)) {
    console.error(`Invalid level: '${level}'`);
    return;
  }

  if (!isvalid(stack, package)) {
    console.error(`Invalid package: '${pkg}' for stack: '${stack}'`);
    return;
  }

  const logentry = {
    stack,
    level,
    package: package,
    message
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(logentry)
    });

    if (!response.ok) {
      console.error(`Log failed: ${response.status}`);
    } else {
      const result = await response.json();
      console.log("Log created:", result.message);
    }
  } catch (err) {
    console.error("Logging error:", err.message);
  }
}

module.exports = {log};

