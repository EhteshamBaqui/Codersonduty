const express = require('express');
const bodyParser = require('body-parser');
const Groq = require("groq-sdk");

const PORT = 3000;

const app = express();
const groq = new Groq({ apiKey: "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" });

app.use(bodyParser.json());

// Set 'ejs' as the view engine
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

// Route to handle incoming requests from the frontend
app.post('/api/groq', async (req, res) => {
  const userInput = req.body.message;

  try {
    const botResponse = await getBotResponse(userInput);
    res.json({ response: botResponse });
  } catch (error) {
    console.error('Error getting bot response:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function getBotResponse(userInput) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: userInput,
      },
    ],
    model: "llama3-70b-8192",
  });

  const botResponse = chatCompletion.choices[0]?.message?.content;

  // If botResponse is undefined, return a default response
  if (!botResponse) {
    return "Sorry, I couldn't understand your question.";
  }

  return botResponse;
}

app.get("/", (req,res)=>{
    res.render("index"); // Assuming your HTML file is named "index.ejs"
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
