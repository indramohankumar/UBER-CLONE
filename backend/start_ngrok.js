const ngrok = require('ngrok');

(async function() {
    try {
        console.log("Starting ngrok on port 8000...");
        const url = await ngrok.connect(8000);
        console.log("==================================================");
        console.log("NGROK IS RUNNING!");
        console.log("Your public URL is:");
        console.log(url);
        console.log("==================================================");
        console.log("Keep this process running to keep the tunnel open.");
    } catch (error) {
        console.error("Error starting ngrok:", error);
        process.exit(1);
    }
})();
