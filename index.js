// Thêm (POST)
async function addTodo() {
  const text = input.value.trim();
  const deadline = timeInput.value;

  if (text && deadline) {
    const newTodo = { text, done: false, deadline };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo)
    });

    const data = await res.json();
    todos.push(data);

    input.value = "";
    timeInput.value = "";

    renderTodos(); // ✅ Vẽ lại sau khi thêm
  }
}

// Xóa (DELETE)
async function deleteTodo(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  todos = todos.filter(todo => todo.id !== id);
  renderTodos(); // ✅ Vẽ lại sau khi xóa
}

// Làm xong (PATCH/PUT)
async function toggleDone(id) {
  const todo = todos.find(t => t.id === id);
  const updated = { ...todo, done: !todo.done };

  await fetch(`${API_URL}/${id}`, {
    method: "PATCH", // PATCH là đúng hơn, PUT sẽ thay toàn bộ object
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done: updated.done })
  });

  todo.done = updated.done;
  renderTodos(); // ✅ Vẽ lại sau khi toggle
}
