const repoOwner = "IvanERMX";
const repoName = "MD_1.0";
const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/`;

// Fetch y render del árbol de archivos
function fetchFileTree(path = "") {
    fetch(apiUrl + path)
        .then(response => response.json())
        .then(data => renderFileTree(data, path))
        .catch(error => console.error("Error fetching file tree:", error));
}

function renderFileTree(files, currentPath) {
    const fileTree = document.getElementById("file-tree");
    fileTree.innerHTML = "";
    files.forEach(file => {
        const li = document.createElement("li");
        li.textContent = file.name;
        li.dataset.path = file.path;
        li.dataset.type = file.type;
        li.addEventListener("click", () => {
            if (file.type === "dir") {
                fetchFileTree(file.path);
            } else if (file.type === "file" && file.name.endsWith(".md")) {
                fetchMarkdownFile(file.path);
            }
        });
        fileTree.appendChild(li);
    });
}

// Fetch y render del archivo Markdown
function fetchMarkdownFile(filePath) {
    fetch(apiUrl + filePath)
        .then(response => response.json())
        .then(file => {
            const markdown = atob(file.content);
            renderMarkdown(markdown);
            generateMarkdownMenu(markdown);
        })
        .catch(error => console.error("Error fetching Markdown file:", error));
}

function renderMarkdown(markdown) {
    const markdownContent = document.getElementById("markdown-content");
    markdownContent.innerHTML = marked.parse(markdown);
}

function generateMarkdownMenu(markdown) {
    const headers = markdown.match(/^#{1,6} .+/gm) || [];
    const menu = document.getElementById("markdown-menu");
    menu.innerHTML = headers
        .map(header => {
            const level = header.match(/^#+/)[0].length;
            const text = header.replace(/^#+ /, "");
            return `<a href="#${text}" style="margin-left: ${level * 10}px;">${text}</a>`;
        })
        .join("<br>");
}

// Manejo de comentarios
document.getElementById("submit-comment").addEventListener("click", () => {
    const commentInput = document.getElementById("comment-input");
    const comment = commentInput.value;
    if (comment) {
        const comments = document.getElementById("comments");
        const commentDiv = document.createElement("div");
        commentDiv.textContent = comment;
        comments.appendChild(commentDiv);
        commentInput.value = "";
    }
});

// Cargar árbol inicial
fetchFileTree();
