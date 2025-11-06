import { consoleTransport, logger } from "react-native-logs";

const log = logger.createLogger({
  transports: [consoleTransport],
  transportOptions: {
    colors: {
      info: "blueBright",
      warn: "yellowBright",
      error: "redBright",
      debug: "white",
    },
  },
  severity: __DEV__ ? "debug" : "error",
});

export default log;
