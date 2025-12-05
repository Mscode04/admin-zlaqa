import { UserData } from "@/hooks/useFirebaseData";

export async function generatePremiumPDF(user: UserData): Promise<void> {
  try {
    // Using html2pdf library (needs to be added to package.json)
    const element = document.createElement("div");
    element.innerHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${user.name} - ZLAQA Assessment Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
            .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; }
            .header h1 { margin: 0 0 10px 0; font-size: 28px; }
            .header p { margin: 5px 0; }
            .section { margin-bottom: 30px; page-break-inside: avoid; }
            .section h2 { color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px; margin-bottom: 15px; }
            .score-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 20px; }
            .score-card { background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #6366f1; }
            .score-card .label { font-size: 12px; color: #666; margin-bottom: 10px; text-transform: uppercase; }
            .score-card .value { font-size: 32px; font-weight: bold; color: #6366f1; }
            .question { background: #f9f9f9; padding: 15px; margin-bottom: 10px; border-left: 3px solid #8b5cf6; border-radius: 4px; }
            .question .q-number { color: #6366f1; font-weight: bold; }
            .question .q-text { color: #333; margin: 5px 0; }
            .question .q-answer { color: #666; font-style: italic; }
            .triggers, .exercises { display: flex; flex-wrap: wrap; gap: 10px; margin: 10px 0; }
            .tag { background: #e9d5ff; color: #6366f1; padding: 5px 10px; border-radius: 4px; font-size: 12px; }
            .exercise-item { background: #f5f5f5; padding: 15px; margin-bottom: 10px; border-radius: 4px; border-left: 3px solid #8b5cf6; }
            .exercise-item h4 { margin: 0 0 8px 0; color: #333; }
            .exercise-item p { margin: 5px 0; font-size: 12px; color: #666; }
            .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .info-table td { padding: 8px; border-bottom: 1px solid #eee; }
            .info-table td:first-child { font-weight: bold; color: #6366f1; width: 30%; }
            .footer { margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #999; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ZLAQA Assessment Report</h1>
            <p><strong>${user.name}</strong></p>
            <p>Email: ${user.email}</p>
            <p>Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
          </div>

          <div class="section">
            <h2>Patient Information</h2>
            <table class="info-table">
              <tr>
                <td>Full Name</td>
                <td>${user.name}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>${user.email}</td>
              </tr>
              <tr>
                <td>WhatsApp/Phone</td>
                <td>${user.whatsapp || "Not provided"}</td>
              </tr>
              <tr>
                <td>Assessment Date</td>
                <td>${new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
              </tr>
              <tr>
                <td>Profile Type</td>
                <td><strong>${user.result?.profileLabel || "Pending"}</strong></td>
              </tr>
            </table>
          </div>

          <div class="section">
            <h2>Clinical Assessment Scores</h2>
            <div class="score-grid">
              <div class="score-card">
                <div class="label">Risk Score</div>
                <div class="value">${user.result?.riskScore || 0}</div>
              </div>
              <div class="score-card">
                <div class="label">Emotion Score</div>
                <div class="value">${user.result?.emotionScore || 0}</div>
              </div>
              <div class="score-card">
                <div class="label">Function Score</div>
                <div class="value">${user.result?.functionScore || 0}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Assessment Questions & Responses</h2>
            ${user.answers?.map((answer, i) => `
              <div class="question">
                <span class="q-number">Q${i + 1}.</span>
                <div class="q-text">Question ID: ${answer.questionId}</div>
                <div class="q-answer"><strong>Answer:</strong> ${Array.isArray(answer.value) ? answer.value.join(", ") : typeof answer.value === "boolean" ? (answer.value ? "Yes" : "No") : answer.value}</div>
              </div>
            `).join("") || "<p>No answers recorded</p>"}
          </div>

          ${user.result?.triggers && user.result.triggers.length > 0 ? `
            <div class="section">
              <h2>Identified Triggers</h2>
              <div class="triggers">
                ${user.result.triggers.map(trigger => `<div class="tag">${trigger}</div>`).join("")}
              </div>
            </div>
          ` : ""}

          ${user.result?.exercises && user.result.exercises.length > 0 ? `
            <div class="section">
              <h2>Recommended Exercises</h2>
              ${user.result.exercises.map(exercise => `
                <div class="exercise-item">
                  <h4>${exercise.name}</h4>
                  <p><strong>Duration:</strong> ${exercise.duration}</p>
                  <p><strong>Description:</strong> ${exercise.description}</p>
                  <p><strong>Benefit:</strong> ${exercise.benefit}</p>
                  ${exercise.steps?.length > 0 ? `
                    <p><strong>Steps:</strong></p>
                    <ol>
                      ${exercise.steps.slice(0, 5).map(step => `<li>${step}</li>`).join("")}
                    </ol>
                  ` : ""}
                </div>
              `).join("")}
            </div>
          ` : ""}

          <div class="footer">
            <p>This is a confidential assessment report. For questions or concerns, please contact ZLAQA support.</p>
            <p>© ${new Date().getFullYear()} ZLAQA. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    // Use html2pdf library
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.onload = () => {
      const opt = {
        margin: 10,
        filename: `${user.name}_ZLAQA_Assessment_Report.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
      };
      (window as any).html2pdf().set(opt).from(element).save();
    };
    document.head.appendChild(script);
  } catch (error) {
    console.error("PDF generation error:", error);
    alert("Failed to generate PDF. Please try again.");
  }
}