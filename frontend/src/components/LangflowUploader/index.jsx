import { useState } from "react";
import styled from "styled-components";
import * as pdfjsLib from "pdfjs-dist";

// Use the matching version for the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

const Wrapper = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 32px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  font-family: 'Segoe UI', sans-serif;
`;

const Title = styled.h2`
  margin-bottom: 24px;
  text-align: center;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #444;
  margin-bottom: 6px;
`;

const Input = styled.input`
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
`;

const Button = styled.button`
  padding: 12px;
  background-color: #4f46e5;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background-color: #4338ca;
  }

  &:disabled {
    background-color: #a5b4fc;
    cursor: not-allowed;
  }
`;

const ResultBox = styled.div`
  margin-top: 32px;
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e5e7eb;
`;

const ResultText = styled.pre`
  white-space: pre-wrap;
  font-family: 'Courier New', monospace;
  color: #111827;
`;

export default function LangflowUploader() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // const toBase64 = (file) =>
  //   new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = reject;
  //   });

  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      let fullText = "";

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(" ");
        fullText += `\n--- Page ${pageNum} ---\n${pageText}\n`;
      }

      return fullText.trim();
    } catch (err) {
      console.error("PDF parsing failed:", err);
      throw new Error("Failed to extract text from PDF.");
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setResult("");

  //   let inputValue = "";

  //   if (file) {
  //     const base64 = await toBase64(file);
  //     inputValue = `Please summarize this PDF:\n${base64}`;
  //   } else {
  //     inputValue = text;
  //   }

  //   try {
  //     const res = await fetch(
  //       "https://langflow.bawana.com/api/v1/run/1553b53f-36d2-4e75-b593-a2b4d83c28d9?stream=false",
  //       {
  //         method: "POST",
  //         headers: {
  //           "x-api-key": "sk-cLerl7mG79V-BrjVZOW__0GSzIGi8eDIExZ5jNB0slY",
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           input_value: inputValue,
  //           output_type: "chat",
  //           input_type: "chat",
  //           tweaks: {
  //             "File-o3QkD": {},
  //             "ParseData-yY0Ub": {},
  //             "Prompt-1eccd": {},
  //             "ChatInput-L83nO": {},
  //             "OpenAIModel-ppjvf": {},
  //             "ChatOutput-IwChK": {},
  //           },
  //         }),
  //       }
  //     );
  //     const data = await res.json();
  //     const responseText =
  //       data?.outputs?.[0]?.outputs?.[0]?.artifacts?.message ||
  //       data?.outputs?.[0]?.outputs?.[0]?.outputs?.message?.message ||
  //       "No output.";
  //     setResult(responseText);
  //   } catch (error) {
  //     console.error("Upload failed:", error);
  //     setResult("Error: Something went wrong.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    let inputValue = "";

    // Convert file to base64 if provided
    if (file) {
      const extractedText = await extractTextFromPDF(file);
      inputValue = `Please summarize this text:\n${extractedText}`;
    } else {
      inputValue = text;
    }

    try {
      const res = await fetch(process.env.REACT_APP_URL, {
        method: "POST",
        headers: {
          "x-api-key": process.env.REACT_APP_LANGFLOW_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input_value: inputValue,
          output_type: "chat",
          input_type: "chat",
          tweaks: {
            "File-o3QkD": {},
            "ParseData-yY0Ub": {},
            "Prompt-1eccd": {},
            "ChatInput-L83nO": {},
            "OpenAIModel-ppjvf": {},
            "ChatOutput-IwChK": {},
          },
        }),
      });

      const data = await res.json();
      const responseText =
        data?.outputs?.[0]?.outputs?.[0]?.artifacts?.message ||
        data?.outputs?.[0]?.outputs?.[0]?.outputs?.message?.message ||
        "No output.";
      setResult(responseText);
    } catch (error) {
      console.error("Upload failed:", error);
      setResult("Error: Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Langflow Uploader</Title>
      <Form onSubmit={handleSubmit2}>
        <div>
          <Label>Choose File (PDF/Excel):</Label>
          <Input
            type="file"
            accept=".pdf,.xlsx,.xls,.csv"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <div>
          <Label>Or Enter Question:</Label>
          <Input
            type="text"
            value={text}
            placeholder="Ask a question..."
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </Button>
      </Form>

      {result && (
        <ResultBox>
          <h3>Result:</h3>
          <ResultText>{result}</ResultText>
        </ResultBox>
      )}
    </Wrapper>
  );
}
