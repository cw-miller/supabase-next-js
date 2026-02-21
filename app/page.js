"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "./components/AuthProvider";

export default function TodosPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  async function fetchTodos() {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error) setTodos(data);
  }

  const addTodo = async () => {
    if (!newTodo.title.trim()) return;
    const { data, error } = await supabase
      .from("todos")
      .insert([{ ...newTodo, user_id: user.id }])
      .select();
    if (!error) setTodos([...data, ...todos]);
    setNewTodo({ title: "", description: "" });
  };

  const toggleComplete = async (id, completed) => {
    const { error } = await supabase
      .from("todos")
      .update({ completed: !completed })
      .eq("id", id)
      .eq("user_id", user.id);
    if (!error)
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
  };

  const deleteTodo = async (id) => {
    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (!error) setTodos(todos.filter((todo) => todo.id !== id));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) return null;

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <h1>My Todos</h1>
          <span className="todo-count">
            {completedCount}/{todos.length} completed
          </span>
        </div>
        <div className="header-right">
          <span className="user-email">{user.email}</span>
          <button onClick={signOut} className="sign-out-btn">
            Sign Out
          </button>
        </div>
      </header>

      <div className="todo-input-section">
        <div className="todo-input-group">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            className="todo-input title-input"
          />
          <input
            type="text"
            placeholder="Add a description (optional)"
            value={newTodo.description}
            onChange={(e) =>
              setNewTodo({ ...newTodo, description: e.target.value })
            }
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            className="todo-input desc-input"
          />
          <button onClick={addTodo} className="add-btn">
            Add
          </button>
        </div>
      </div>

      <ul className="todo-list">
        {todos.length === 0 && (
          <li className="empty-state">
            <p>No todos yet. Add one above!</p>
          </li>
        )}
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`todo-item ${todo.completed ? "completed" : ""}`}
          >
            <div
              className="todo-content"
              onClick={() => toggleComplete(todo.id, todo.completed)}
            >
              <div
                className={`todo-checkbox ${todo.completed ? "checked" : ""
                  }`}
              >
                {todo.completed && "✓"}
              </div>
              <div className="todo-text">
                <h2 className="todo-title">{todo.title}</h2>
                {todo.description && (
                  <p className="todo-description">{todo.description}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="delete-btn"
              title="Delete todo"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}