document.addEventListener("DOMContentLoaded", () => {
  // Set default date to today
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("datePicker").value = today;
  document.getElementById("insightDate").innerText = today;
});

function fetchInsight() {
  const selectedDate = document.getElementById("datePicker").value;
  if (!selectedDate) {
      alert("Please select a date first");
      return;
  }

  document.getElementById("insightDate").innerText = selectedDate;
  document.getElementById("insightBox").innerHTML = "<div class='text-center py-4'><i class='fas fa-spinner fa-spin text-cyan-700'></i> Generating insights...</div>";

  fetch(`/get_insight?date=${selectedDate}`)
  .then(res => res.json())
  .then(data => {
      if (data.insight) {
          const formattedInsight = data.insight
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')       // Bold text
              .replace(/\n/g, '<br>')                                 // Line breaks
              .replace(/- (.*?)(<br>|$)/g, '• $1$2')                   // Bullet points
              .replace(/(\d+\.) (.*?)(<br>|$)/g, '<br><strong>$1 $2</strong>$3'); // Numbered lists

          document.getElementById("insightBox").innerHTML = `
              <div class="p-3 mt-2 mb-2">
                  <h3 class="font-bold text-lg mb-2">AI Insights for ${data.date}</h3>
                  <div class="border-t pt-2">${formattedInsight}</div>
              </div>
          `;
      } else if (data.error) {
          document.getElementById("insightBox").innerHTML = `
              <div class="text-red-500 p-4">
                  Error: ${data.error}
              </div>
          `;
      }
  })
  .catch(err => {
      console.error("Error fetching insight:", err);
      document.getElementById("insightBox").innerHTML = `
          <div class="text-red-500 p-4">
              Failed to generate insights. Please try again.
          </div>
      `;
  });
}

function exportPDF() {
    const element = document.getElementById("insightBox");
    const date = document.getElementById("insightDate").innerText || "insight";
    
    const opt = {
      margin: [0.2, 0.5, 0.2, 0.5], // top, left, bottom, right (in inches)
      filename: `AI_Insight_${date}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollY: 0 // Prevents image offset
      },
      jsPDF: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait'
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
  
    html2pdf().set(opt).from(element).save();
  }
  