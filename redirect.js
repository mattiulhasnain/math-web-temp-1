// This script ensures correct redirection to tools
function redirectToTool(toolName) {
    let toolUrl = toolName + '.html';
    console.log("Redirecting to: " + toolUrl);
    window.location.href = toolUrl;
}

// Redirect helper function
function goToPage(pageName) {
    window.location.href = pageName;
} 