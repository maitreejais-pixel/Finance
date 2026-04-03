const Record = require("../models/Record");

/**
 * ZORVYN RISK ENGINE
 * Simulates a multi-stage AI audit for financial transactions.
 */
const analyzeRisk = async (recordId) => {
  const io = require("../server").app.get("io");
  const record = await Record.findById(recordId);

  if (!record) return;

  // Rebranded Audit Steps (Total: 5 seconds for a snappy UI)
  const steps = [
    { name: "Verifying Merchant Credentials", duration: 1.5 },
    { name: "Checking for Duplicate Entries", duration: 2 },
    { name: "Calculating AML Risk Score", duration: 1.5 },
  ];

  let totalProgress = 0;
  const totalDuration = steps.reduce((acc, s) => acc + s.duration, 0);

  for (let step of steps) {
    // Simulate the "Work"
    await new Promise((resolve) => setTimeout(resolve, step.duration * 1000));

    totalProgress += (step.duration / totalDuration) * 100;

    // Real-time update to the Frontend via Socket.io
    if (io) {
      io.to(recordId.toString()).emit("progress", {
        recordId,
        progress: Math.min(totalProgress, 100),
        step: step.name,
        status: "verifying",
      });
    }
  }

  // ZORVYN AUDIT LOGIC:
  // Automatically flag any expense over 10,000 OR a random 10% "Spot Check"
  const isHighValue = record.type === "expense" && record.amount > 10000;
  const randomAudit = Math.random() < 0.1;

  const isFlagged = isHighValue || randomAudit;

  record.status = isFlagged ? "flagged" : "verified";
  // Rebranded 'sensitivityScore' to 'riskScore'
  record.riskScore = isFlagged
    ? 0.75 + Math.random() * 0.2
    : Math.random() * 0.15;

  await record.save();

  // Final completion signal
  if (io) {
    io.to(recordId.toString()).emit("complete", {
      recordId,
      status: record.status,
      riskScore: record.riskScore,
    });
  }

  return record;
};

module.exports = { analyzeRisk };
