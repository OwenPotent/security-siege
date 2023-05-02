import chalk from "chalk";

export default class Logger {
    public static log(content: any, type: string = "log") {
        const timestamp: string = `[${new Date().toLocaleString()}]`;
        switch (type) {
            case "log": {
                return console.log(`${timestamp} ${chalk.bgBlue(type.toUpperCase())} | ${content} `);
            }
            case "warn": {
                return console.log(`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} | ${content} `);
            }
            case "error": {
                return console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} | ${content} `);
            }
            case "debug": {
                return console.log(`${timestamp} ${chalk.green(type.toUpperCase())} | ${content} `);
            }
            case "cmd": {
                return console.log(`${timestamp} ${chalk.black.bgWhite(type.toUpperCase())} | ${content}`);
            }
            case "ready": {
                return console.log(`${timestamp} ${chalk.black.bgGreen(type.toUpperCase())} | ${content}`);
            }
            default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
        }
    }

    public static error(content: any) {
        return this.log(content, "error");
    }

    public static warn(content: any) {
        return this.log(content, "warn");
    }

    public static debug(content: any) {
        return this.log(content, "debug");
    }

    public static cmd(content: any) {
        return this.log(content, "cmd");
    }
}