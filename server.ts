import express from "express";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.post("/api/notify-admin", async (req, res) => {
    const { examId, examTitle, studentEmail, studentName, type, description } = req.body;
    
    // Log the alert to server console for admin reference
    const alertMessage = `[ProctorEdge] 🚨 CHEATING ALERT 🚨\n\n👤 Candidate: ${studentName || 'Unknown'}\n📧 Email: ${studentEmail}\n📝 Exam: ${examTitle || examId}\n⚠️ Type: ${type}\n🔍 Details: ${description}`;
    
    console.log(`[ALERT LOG] ${alertMessage}`);
    
    // Twilio notifications have been disabled per user request
    res.json({ success: true, message: "Alert logged to server system." });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ProctorEdge Unified Server running on http://localhost:${PORT}`);
  });
}

startServer();
