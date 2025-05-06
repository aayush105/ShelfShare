import cron from "cron";
import https from "https";

const job = new cron.CronJob("*/14 * * * *", function () {
  https
    .get(process.env.API_URL, (res) => {
      if (res.statusCode === 200)
        console.log("Cron job executed successfully.");
      else console.log("Cron job failed with status code:", res.statusCode);
    })
    .on("error", (err) => {
      console.error("Error executing cron job:", err);
    });
});

export default job;

// corn job explanation
// cron jobs are scheduled tasks that run periodically at specified intervals.
// we want to send 1 get request every 14 minutes to the API_URL

// how to define a "schedule" for a cron job
// the schedule is defined using a cron expression, which consists of five fields separated by spaces

// the five fields are as follows:
//* 14 * * * * - every 14 minutes
//* 0 0 * * 0 - at midnight on Sundays
//* 30 3 15 * * - at 3:30 AM on the 15th of every month
//* 0 0 1 * * - at midnight on the first day of every month
//* 0 0 * * * - at midnight every day
//* 0 0 1 1 * - at midnight on January 1st every year
//* 0 * * * * - every hour at the start of the hour
