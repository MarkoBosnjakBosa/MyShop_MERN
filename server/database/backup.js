import { spawn } from "child_process";
import * as cron from "node-cron";
import * as fs from "fs";
import path from "path";
const directory = path.resolve();

const backup = () => {
  const currentDate = new Date().toLocaleDateString("de-DE");
  let oldDate = new Date();
  oldDate.setDate(oldDate.getDate() - 7);
  oldDate = oldDate.toLocaleDateString("de-DE");
  const stream = fs.createWriteStream(`${directory}/database/logs.md`, { flags: "a" });

  cron.schedule("0 0 * * *", () => {
    removeBackup();
    createBackup();
  });

  const removeBackup = () => {
    const archive = `${directory}/database/backups/MyShop_${oldDate}.gzip`;
    if (fs.existsSync(archive)) {
      fs.unlink(archive, (error) => {
        const dateAndTime = new Date().toLocaleString("de-DE");
        if (error) {
          stream.write(`\n${dateAndTime} Backup **MyShop_${oldDate}.gzip** has not been deleted!`);
        } else {
          stream.write(`\n${dateAndTime} Backup **MyShop_${oldDate}.gzip** has been successfully deleted!`);
        }
      });
    }
  };

  const createBackup = () => {
    const archive = `${directory}/database/backups/MyShop_${currentDate}.gzip`;
    const child = spawn("mongodump", ["--db=myshop", `--archive=${archive}`]);
    const dateAndTime = new Date().toLocaleString("de-DE");
    child.stdout.on("data", (data) => {
      stream.write(`\n${dateAndTime} Stdout: ${data}`);
    });
    child.stderr.on("data", (data) => {
      stream.write(`\n${dateAndTime} Stderr: ${String(Buffer.from(data))}`);
    });
    child.on("error", (error) => {
      stream.write(`\n${dateAndTime} Error: ${error}`);
    });
    child.on("exit", (code, signal) => {
      if (code) stream.write(`\n${dateAndTime} Process exits with code: ${code}`);
      else if (signal) stream.write(`\n${dateAndTime} Process killed with signal: ${signal}`);
      else stream.write(`\n${dateAndTime} Backup **MyShop_${currentDate}.gzip** has been successfully created!`);
    });
  };
};

export default backup;
