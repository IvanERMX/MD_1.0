const repoOwner = "IvanERMX";  // Reemplaza con tu usuario de GitHub
const repoName = "MD_1.0";    // Reemplaza con el nombre de tu repositorio
const apiUrl = `https://api.github.com/repos/IvanERMX/MD_1.0/contents/`;

// Función para obtener y mostrar el árbol de archivos
function fetchFileTree(path = "") {
    fetch(apiUrl + path)
        .then(response => response.json())
        .then(data => renderFileTree(data, path))
        .catch(error => console.error("Error fetching file tree:", error));
}

// Función para renderizar el árbol de archivos
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

// Función para obtener el archivo Markdown
function fetchMarkdownFile(filePath) {
    fetch(apiUrl + filePath)
        .then(response => response.json())
        .then(file => {
            const markdown = atob(file.content);  // Decodifica el contenido en base64
            renderMarkdown(markdown);
            generateMarkdownMenu(markdown);
        })
        .catch(error => console.error("Error fetching Markdown file:", error));
}

// Función para renderizar el contenido de Markdown
function renderMarkdown(markdown) {
    const markdownContent = document.getElementById("markdown-content");
    markdownContent.innerHTML = marked.parse(markdown);  // Convierte Markdown a HTML
}

// Función para generar el menú de navegación por encabezados
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

// Función para agregar un comentario
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

// Cargar el árbol de archivos cuando se cargue la página
fetchFileTree();
