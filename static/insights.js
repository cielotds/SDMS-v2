document.addEventListener("DOMContentLoaded", () => {
    loadTodayInsight();
  });
  
  function loadTodayInsight() {
    const today = new Date().toISOString().split("T")[0];
    fetchInsight(today);
  }
  
  function fetchInsight(date = null) {
    const selectedDate = date || document.getElementById("datePicker").value;
    if (!selectedDate) return;
  
    fetch(`/get_insight/${selectedDate}`)
      .then(res => res.json())
      .then(data => {
        if (data.insight || data.recommendations) {
          document.getElementById("insightDate").innerText = selectedDate;
  
          let insightText = "";
          if (data.insight) {
            insightText += `**Business Insight**\n${data.insight}\n\n`;
          }
          if (data.recommendations && data.recommendations.length > 0) {
            insightText += "**Product Recommendations**\n";
            data.recommendations.forEach(r => {
              insightText += `- ${r.product_name}: ${r.recommendation}\n`;
            });
          }
  
          document.getElementById("insightBox").innerText = insightText;
        } else {
          alert("Not Available");
        }
      })
      .catch(err => {
        console.error("Error fetching insight:", err);
        alert("An error occurred while fetching insight.");
      });
  }
  
  function exportPDF() {
    const element = document.getElementById("insightBox");
    const date = document.getElementById("insightDate").innerText || "insight";
    const opt = {
      margin: 1,
      filename: `AI_Insight_${date}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  }
  