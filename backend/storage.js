
const fs = require("fs");
const path = require("path");

const historyPath = path.join(__dirname, "chatHistory.json");

// Clear chat history file on dev start
try {
  if (fs.existsSync(historyPath)) {
    fs.unlinkSync(historyPath); // deletes the file
    console.log("Chat history cleared.");
  }
} catch (err) {
  console.error("Error clearing chat history:", err);
}


function loadChatHistory() {
  if (!fs.existsSync(historyPath)) return {};
  try {
    const data = fs.readFileSync(historyPath);
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading chat history:", err);
    return {};
  }
}

function saveChatHistory(history) {
  try {
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
  } catch (err) {
    console.error("Error saving chat history:", err);
  }
}

module.exports = { loadChatHistory, saveChatHistory };
