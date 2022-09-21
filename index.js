const QarnotSDK = require('@qarnot/sdk');

const qarnot = new QarnotSDK({
    auth: 'd003dcc9ce1d10b3a1435a7f0d06fe426afe1ac70e1b17ea7f707c6fbe95eb62',
    clusterUrl: 'https://api.dev.qarnot.com',
    storageUrl: 'https://storage.dev.qarnot.com',
});

(async () => {
    const tasks = await getOldestTasks(100);
    console.log(await isTasksAtMax());
    deleteTasks(tasks, (t) => console.log('[OK]',t.uuid), (t) => console.log('[XX]', t.uuid));
})()

function deleteTasks(tasks, onSuccess, onError) {
    const purge = async ({ task, promise }) => {
        try {
            await promise;
            onSuccess(task);
        } catch (e) {
            onError(task, e);
        }
    }
    tasks
      .map((task) => ({
        task,
        promise: qarnot.tasks.delete(task.uuid),
      }))
      .forEach(purge);
}
;

async function getFailingTasks() {
  const tasks = await qarnot.tasks.list();
  const isFailed = (task) => /Failure|Cancelled/.test(task.state);
  return tasks.filter(isFailed).map((t) => t.uuid);
}

async function isRunningTasksAtMax() {
    const user = await qarnot.user.get();
    return user.runningTaskCount >= user.maxRunningTask;
}

async function isTasksAtMax() {
    const user = await qarnot.user.get();
    return user.taskCount >= user.maxTask;
}

async function getOldestTasks(n) {
  const tasks = await qarnot.tasks.list();
  const byDateSort = (task1, task2) =>
    new Date(task1.creationDate).getTime() >=
    new Date(task2.creationDate).getTime();
  return tasks.sort(byDateSort).filter((_, i) => i < n);
}