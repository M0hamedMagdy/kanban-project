const { useState } = React;

const INITIAL_TASKS = [
  {
    id: 0,
    boardId: "ToDo",
    title: "Task A"
  },
  {
    id: 1,
    boardId: "ToDo",
    title: "Task B"
  },
  {
    id: 2,
    boardId: "In Progress",
    title: "Task C"
  }
];

function Task({
  title,
  moveUp,
  moveDown,
  moveLeft,
  moveRight,
  isFirst,
  isLast
}) {
  return (
    <>
      <div className="task">
        <div>{title}</div>
        <div className="buttons">
          <button onClick={moveUp} disabled={isFirst}>
            ⇧
          </button>
          <button onClick={moveDown} disabled={isLast}>
            ⇩
          </button>
          <button onClick={moveLeft}>⇦</button>
          <button onClick={moveRight}>⇨</button>
        </div>
      </div>
    </>
  );
}

function List({ title, tasks, onMoveTask }) {
  return (
    <>
      <div className="list">
        <h3>{title}</h3>
        {tasks.map((task, index) => (
          <Task
            key={task.id}
            title={task.title}
            moveUp={() => onMoveTask(task.id, "up")}
            moveDown={() => onMoveTask(task.id, "down")}
            moveLeft={() => onMoveTask(task.id, "left")}
            moveRight={() => onMoveTask(task.id, "right")}
            isFirst={index === 0}
            isLast={index === tasks.length - 1}
          />
        ))}
      </div>
    </>
  );
}

function Board() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const handleMoveTask = (taskId, direction) => {
    setTasks((prevTasks) => {
      const taskIndex = prevTasks.findIndex((task) => task.id === taskId);
      if (taskIndex === -1) return prevTasks; // handle error if task is not found
      const task = prevTasks[taskIndex];
      const newTasks = [...prevTasks]; // Copy the array
      // Define the order of the lists
      const listsOrder = ["ToDo", "In Progress", "Done"];
      if (direction === "up" && taskIndex > 0) {
        // Swap with the previous task in the list
        [newTasks[taskIndex - 1], newTasks[taskIndex]] = [
          newTasks[taskIndex],
          newTasks[taskIndex - 1]
        ];
      } else if (direction === "down" && taskIndex < newTasks.length - 1) {
        // Swap with the next task in the list
        [newTasks[taskIndex + 1], newTasks[taskIndex]] = [
          newTasks[taskIndex],
          newTasks[taskIndex + 1]
        ];
      } else if (direction === "left") {
        // Move to the previous list
        const currentListIndex = listsOrder.indexOf(task.boardId);
        if (currentListIndex > 0) {
          task.boardId = listsOrder[currentListIndex - 1];
        }
      } else if (direction === "right") {
        // Move to the next list
        const currentListIndex = listsOrder.indexOf(task.boardId);
        if (currentListIndex < listsOrder.length - 1) {
          task.boardId = listsOrder[currentListIndex + 1];
        }
      }
      return newTasks;
    });
  };

  const lists = ["ToDo", "In Progress", "Done"];

  return (
    <div className="board">
      {lists.map((list) => (
        <List
          key={list}
          title={list}
          tasks={tasks.filter((task) => task.boardId === list)}
          onMoveTask={handleMoveTask}
        />
      ))}
    </div>
  );
}

function App() {
  return <Board />;
}

ReactDOM.render(<App />, document.getElementById("root"));
