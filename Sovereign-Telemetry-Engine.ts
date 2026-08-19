// Sovereign-Telemetry-Engine.ts
// Beast System 3.0 — Sovereign Telemetry Engine

export class SovereignTelemetryEngine {
  constructor(
    identityStateEngine,
    civicGraphRuntime,
    resolutionEngine,
    lucrEngine,
    municipalEngine,
    globalEngine,
    constitutionalEngine,
    bindingHub,
    orchestrator,
    kernel
  ) {
    this.identityStateEngine = identityStateEngine;
    this.civicGraphRuntime = civicGraphRuntime;
    this.resolutionEngine = resolutionEngine;
    this.lucrEngine = lucrEngine;
    this.municipalEngine = municipalEngine;
    this.globalEngine = globalEngine;
    this.constitutionalEngine = constitutionalEngine;
    this.bindingHub = bindingHub;
    this.orchestrator = orchestrator;
    this.kernel = kernel;

    this.subscribers = new Set();
  }

  // ---- SUBSCRIBE TO TELEMETRY ----
  subscribe(callback) {
    this.subscribers.add(callback);
  }

  unsubscribe(callback) {
    this.subscribers.delete(callback);
  }

  // ---- COLLECT TELEMETRY SNAPSHOT ----
  collectSnapshot() {
    return {
      timestamp: Date.now(),

      // Identity-level telemetry
      identities: [...this.identityStateEngine.identities.entries()].map(
        ([id, state]) => ({ id, ...state })
      ),

      // CivicGraph telemetry
      civicGraphEdges: [...this.civicGraphRuntime.graph.entries()].map(
        ([id, edges]) => ({ id, edges })
      ),

      // Resolution telemetry
      resolutions: [...this.resolutionEngine.resolutions.entries()].map(
        ([id, res]) => ({ id, ...res })
      ),

      // LUCR economic telemetry
      lucr: [...this.lucrEngine.lucrState.entries()].map(
        ([id, econ]) => ({ id, ...econ })
      ),

      // Municipal telemetry
      municipal: this.municipalEngine.getMunicipalState(),

      // Global telemetry
      global: this.globalEngine.getGlobalState(),

      // Constitutional telemetry
      constitutional: this.constitutionalEngine.constitutionalState,

      // Routing telemetry
      routing: {
        lastSweep: Date.now()
      },

      // Orchestrator telemetry
      orchestrator: {
        running: this.orchestrator.running
      },

      // Kernel telemetry
      kernel: {
        running: this.kernel.running
      }
    };
  }

  // ---- BROADCAST TELEMETRY ----
  broadcast(snapshot) {
    for (const callback of this.subscribers) {
      callback(snapshot);
    }
  }

  // ---- TELEMETRY HEARTBEAT ----
  start(interval = 2000) {
    this.running = true;
    this.loop(interval);
  }

  stop() {
    this.running = false;
  }

  async loop(interval) {
    while (this.running) {
      const snapshot = this.collectSnapshot();
      this.broadcast(snapshot);
      await this.sleep(interval);
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
