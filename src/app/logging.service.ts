export class LoggingService {
  logToConsole(logMessage: string) {
    console.log(logMessage);
  }
  logIdValueToConsole(id: string, value: string){
    console.log(id, value);
  }
}
