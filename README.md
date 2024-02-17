# Prerequisites

- Node.js v20.6.0

# Setting up the application

## Windows
Run `npm install`

Copy `env.sample` and name it `.env`:
```bat
copy env.sample .env
```

Fill the copied `.env` file with correct information

Add your scheduled tasks to `schedule.xlsx`

Optionally: Add the scheduler to autostart, so it can add your scheduled tasks every time you run your PC
```bat
SCHTASKS /CREATE /SC ONLOGON /TN "MyTasks\ObsidianKanbanScheduler" /TR "npm start --prefix 'C:\PROJECT\LOCATION\ObsidianKanbanScheduler'"
```

## Unix

Same as above, but gotta figure out the commands yourself :(


# TODO

- Make the app detect tasks that were not added from last X days (for example when user didn't run the app for a while)
- Tests
- Make `lastRun.log` auto-create and remove from git tracking