const output = document.getElementById("output");
const buttons = document.querySelectorAll("#controls button");
const terminate = document.getElementById("terminate");

let markdownText = "";

// basic markdown → HTML (enough for our use)
function renderMarkdown(md) {
    return md
        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/^## (.*$)/gim, "<h2>$1</h2>")
        .replace(/^# (.*$)/gim, "<h1>$1</h1>")
        .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
        .replace(/\n\n/gim, "<br><br>");
}

// extract section by heading name
function extractSection(title) {
    const regex = new RegExp(
        `## ${title}[\\s\\S]*?(?=\\n## |$)`,
        "i"
    );
    const match = markdownText.match(regex);
    return match ? renderMarkdown(match[0]) : "<div class='subtle'>no data recovered</div>";
}

// load markdown
fetch("leak.md")
    .then(res => res.text())
    .then(text => markdownText = text);

// button behavior
buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const section = btn.dataset.section;
        output.innerHTML = `
      <div class="subtle">accessing fragment…</div><br>
      ${extractSection(section)}
    `;
    });
});

// terminate feed
terminate.addEventListener("click", () => {
    output.innerHTML = "<div class='subtle'>connection closed.</div>";
});
