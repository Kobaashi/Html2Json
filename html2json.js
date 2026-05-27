const Html = `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HTML to JSON</title>
    <script src="html2json.js"></script>
    <style>
      h1 {
        font-family: sans-serif
      }
      body {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .container {
        display: flex;
        width: 100%;
        gap: 10px;
      }

      .field {
        display: flex;
        flex-direction: column;
        width: 50%;
      }

      textarea {
        width: 100%;
        height: calc(100vh - 170px);
        max-width: 100%;
        white-space: pre;
      }

      .buttons {
        display: flex;
        gap: 10px;
        margin-top: 10px;
      }

      button {
        width: 150px;
        height: 40px;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <h1>Jito's Software Developer Intern "html2json" Test Task</h1>

    <div class="container">
      <div class="field">
        <label for="html">Input for "html2json" conversion:</label>
        <textarea id="html" placeholder="Enter your HTML"></textarea>
      </div>
      <div class="field">
        <label for="json">Results of "html2json" conversion:</label>
        <textarea disabled id="json" placeholder="Here will be output from your html2json function"></textarea>
      </div>
    </div>
    <div class="buttons">
      <button onclick="convertHtml2JsonAndSet()">Convert to JSON</button>
      <button onclick="showExample1()">Input Example 1</button>
      <button onclick="showExample2()">Input Example 2</button>
    </div>
  </body>
</html>
`;

function html2json(Html) {
  if (typeof Html !== "string") {
    return {
      error: "Html should be a string",
    };
  }

  return ParseHtml(Html);
}

function ParseHtml(Html) {
  const parsed = [];

  let i = 0;

  while (i < Html.length) {
    // =========================
    // TAG PARSING
    // =========================
    if (Html[i] === "<") {
      const closeIndex = Html.indexOf(">", i);

      // broken html
      if (closeIndex === -1) {
        break;
      }

      // remove < and >
      const rawTag = Html.slice(i + 1, closeIndex).trim();

      // =========================
      // COMMENT
      // =========================
      if (rawTag.startsWith("!--")) {
        i = closeIndex + 1;
        continue;
      }

      // =========================
      // CLOSE TAG
      // =========================
      if (rawTag.startsWith("/")) {
        parsed.push({
          type: "CLOSE_TAG",
          tag: rawTag.slice(1).trim(),
        });
      }

      // =========================
      // OPEN TAG
      // =========================
      else {
        const { tag, attributes } = parseTag(rawTag);

        parsed.push({
          type: "OPEN_TAG",
          tag,
          attributes,
        });
      }

      i = closeIndex + 1;
      continue;
    }

    // =========================
    // TEXT PARSING
    // =========================
    else {
      let textEnd = Html.indexOf("<", i);

      if (textEnd === -1) {
        textEnd = Html.length;
      }

      const text = Html.slice(i, textEnd);

      // skip empty whitespace
      if (text.trim()) {
        parsed.push({
          type: "TEXT",
          content: text.trim(),
        });
      }

      i = textEnd;
      continue;
    }
  }

  return parsed;
}

function parseTag(rawTag) {
  // split by spaces
  const parts = rawTag.split(/\s+/);

  // first word = tag name
  const tag = parts[0];

  const attributes = {};

  // remove tag name
  const attrString = rawTag.slice(tag.length).trim();

  // key="value"
  const attrRegex = /([a-zA-Z0-9:-]+)\s*=\s*"([^"]*)"/g;

  let match;

  while ((match = attrRegex.exec(attrString)) !== null) {
    attributes[match[1]] = match[2];
  }

  return {
    tag,
    attributes,
  };
}

const result = html2json(Html);

console.log(JSON.stringify(result, null, 2));
