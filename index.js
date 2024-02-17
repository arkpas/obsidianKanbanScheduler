const xlsx = require("xlsx");
const fs = require("fs");

if (!isFirstRunInTheDay()) {
	console.log("Scheduler already ran today, exiting");
	return;
}

const tasks = getTasksToAdd();
writeTasksToFile(tasks);
logSuccessfulRun();

function isFirstRunInTheDay() {
	const lastRunDate = fs.readFileSync("./lastRun.log", { encoding: "utf8" });

	return lastRunDate !== new Date().toLocaleDateString();
}

function getTasksToAdd() {
    const taskColName = "Task";
	const workbook = xlsx.readFile("./schedule.xlsx");

    // Get tasks from file while ignoring column names (done automatically by library)
    // and ignoring first row with data which contains field descriptions (done by slicing)
	const dataRows = xlsx.utils.sheet_to_json(
		workbook.Sheets[workbook.SheetNames[0]]
	).slice(1);

	const newTasks = [];
	dataRows.forEach((dataRow) => {
        if (shouldTaskBeAddedToday(dataRow)) {
		    newTasks.push(`- [ ] ${dataRow[taskColName]}`);
        }
	});

	return newTasks;
}

function shouldTaskBeAddedToday(task) {
	if (!task) return;

	const dayOfTheWeekColName = "Day of the week";
	const dayOfTheMonthColName = "Day of the month";
	const currentDate = new Date();
	const currentDayOfTheWeek = currentDate.getDay();
	const currentDayOfTheMonth = currentDate.getDate();

	return (
		task[dayOfTheWeekColName] === currentDayOfTheWeek ||
		task[dayOfTheMonthColName] === currentDayOfTheMonth
	);
}

function writeTasksToFile(tasks) {
    const obsidianKanbanPath = process.env.OBSIDIAN_KANBAN_FILE_PATH;
    const obsidianKanbanListName = process.env.OBSIDIAN_KANBAN_LIST_NAME;

	if (!tasks || tasks.length == 0) return;

	const fileData = fs.readFileSync(obsidianKanbanPath, { encoding: "utf8" });
	const fileDataArray = fileData.split("\n");
	const indexOfOpenTasks = fileDataArray.indexOf(
		`## ${obsidianKanbanListName}`
	);

	if (indexOfOpenTasks < 0)
		throw new Error(
			`List with name ${obsidianKanbanListName} was not found in Kanban file!`
		);

	tasks.forEach((task) => {
		// Insert data AFTER the list name in Kanban file
		// Kanban in Obsidian leaves one empty line after each list name, thats why we do index + 2
		fileDataArray.splice(indexOfOpenTasks + 2, 0, task);
	});

	const newFileData = fileDataArray.join("\n"); // create the new file
	fs.writeFileSync(obsidianKanbanPath, newFileData, { encoding: "utf8" }); // save it
}

function logSuccessfulRun() {
	fs.writeFileSync("./lastRun.log", new Date().toLocaleDateString(), {
		encoding: "utf8",
	});
}
