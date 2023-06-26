/* eslint @typescript-eslint/no-explicit-any: 0 */

export class Logger {
  _contextId: string;
  _serviceName: string;

  constructor(serviceName: string, contextId?: string) {
    this._contextId = contextId ?? '';
    this._serviceName = serviceName;
  }

  Error = (err: Error) => {
    const payload: LogPayload = { service_name: this._serviceName, context_id: this._contextId, type: 'CRITICAL', message: err.message, callStack: err.stack };
    console.error("\u001b[1;31m " + JSON.stringify(payload) + "\u001b[0m");
  };

  Warning = (payload: LogPayload) => {
    payload = { service_name: this._serviceName, context_id: this._contextId, type: 'WARNING', ...payload };
    console.log("\u001b[1;33m " + JSON.stringify(payload) + "\u001b[0m");
  };

  Info = (payload: LogPayload) => {
    payload = { service_name: this._serviceName, context_id: this._contextId, type: 'INFO', ...payload };
    console.log("\u001b[1;34m " + JSON.stringify(payload) + "\u001b[0m");
  };
}

export interface LogPayload {
  service_name?: string;
  context_id?: string;
  type?: string;
  data?: any;
  message?: string;
  callStack?: string;
}
