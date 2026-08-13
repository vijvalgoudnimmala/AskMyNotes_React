import { useState } from "react";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    }
  };

  const askQuestion = async () => {
    const cleanedQuestion = question.trim();

    if (!cleanedQuestion) {
      setError("Please enter a question.");
      setAnswer("");
      return;
    }

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: cleanedQuestion,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend returned status ${response.status}`);
      }

      const data = await response.json();

      setAnswer(data.answer);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to the backend. Check whether FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="card">

        <header className="header">
          <h1>AskMyNotes AI</h1>
          <p>Upload your notes and ask questions from them.</p>
        </header>

        <div className="divider"></div>

        <section className="section">
          <h2>Upload Notes</h2>

          <label className="input-label">
            Choose your notes file:
          </label>

          <div className="file-upload">
            <input
              id="notes-file"
              type="file"
              onChange={handleFileChange}
            />

            <label
              htmlFor="notes-file"
              className="choose-file"
            >
              Choose file
            </label>

            <span className="file-name">
              {file ? file.name : "No file chosen"}
            </span>
          </div>

          <p className="upload-status">
            {file ? `Uploaded: ${file.name}` : "No file uploaded"}
          </p>
        </section>

        <div className="divider"></div>

        <section className="section">
          <h2>Ask a Question</h2>

          <label className="input-label" htmlFor="question">
            Enter your question:
          </label>

          <textarea
            id="question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask anything from your notes..."
          />

          <button
            className="ask-button"
            onClick={askQuestion}
            disabled={loading}
          >
            {loading ? "Asking..." : "Ask My Notes"}
          </button>

          {error && (
            <div className="error">
              {error}
            </div>
          )}
        </section>

        <div className="divider"></div>

        <section className="answer-section">
          <h2>Answer</h2>

          <div className="answer-content">
            {answer && <p>{answer}</p>}
          </div>
        </section>

        <footer className="footer">
          AskMyNotes AI Capstone Project
        </footer>

      </section>
    </main>
  );
}

export default App;