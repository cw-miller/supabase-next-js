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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="w-10 h-10 border-3 border-slate-700 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  const completedCount = todos.filter((t) => t.completed).length;
  const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 px-4">
      <div className="max-w-2xl mx-auto animate-[fadeInUp_0.4s_ease]">

        {/* Header */}
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              My Todos
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {todos.length === 0
                ? "Start by adding a task"
                : `${completedCount} of ${todos.length} completed`}
            </p>
            {/* Progress bar */}
            {todos.length > 0 && (
              <div className="mt-3 w-48 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 max-w-[140px] overflow-hidden text-ellipsis whitespace-nowrap hidden sm:block">
              {user.email}
            </span>
            <button
              onClick={signOut}
              className="text-slate-400 hover:text-red-400 text-sm font-medium px-3 py-1.5 rounded-lg border border-slate-700 hover:border-red-500/40 transition-all cursor-pointer bg-transparent"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Add Todo Card */}
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 mb-6 shadow-lg shadow-black/10">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              className="flex-[2] bg-slate-700/40 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newTodo.description}
              onChange={(e) =>
                setNewTodo({ ...newTodo, description: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              className="flex-[3] bg-slate-700/40 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            />
            <button
              onClick={addTodo}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 active:scale-95 text-white font-semibold px-6 py-2.5 rounded-lg transition-all whitespace-nowrap cursor-pointer shadow-lg shadow-indigo-500/20"
            >
              Add
            </button>
          </div>
        </div>

        {/* Todo List */}
        <ul className="flex flex-col gap-2">
          {todos.length === 0 && (
            <li className="text-center py-16 animate-[fadeInUp_0.5s_ease]">
              <div className="text-4xl mb-3 opacity-30">📝</div>
              <p className="text-slate-500 text-sm">No todos yet — add your first task above!</p>
            </li>
          )}
          {todos.map((todo, i) => (
            <li
              key={todo.id}
              className={`group flex justify-between items-center px-4 py-3.5 rounded-xl border transition-all duration-200 animate-[slideIn_0.3s_ease] ${todo.completed
                  ? "bg-slate-800/30 border-slate-700/30 opacity-60"
                  : "bg-slate-800/60 border-slate-700/50 hover:border-slate-600"
                }`}
            >
              <div
                className="flex items-center gap-3.5 cursor-pointer flex-1 min-w-0"
                onClick={() => toggleComplete(todo.id, todo.completed)}
              >
                {/* Custom Checkbox */}
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold border-2 transition-all duration-200 flex-shrink-0 ${todo.completed
                      ? "bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-500/30"
                      : "bg-transparent border-slate-600 text-transparent hover:border-indigo-400"
                    }`}
                >
                  ✓
                </div>
                <div className="min-w-0">
                  <h2
                    className={`text-sm font-medium transition-all duration-200 ${todo.completed
                        ? "line-through text-slate-500"
                        : "text-slate-200"
                      }`}
                  >
                    {todo.title}
                  </h2>
                  {todo.description && (
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {todo.description}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-slate-600 group-hover:text-slate-400 hover:!text-red-400 text-sm ml-3 transition-all cursor-pointer bg-transparent border-none p-1.5 rounded-md hover:bg-red-500/10"
                title="Delete todo"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        {/* Footer */}
        {todos.length > 0 && (
          <div className="text-center mt-8 text-xs text-slate-600">
            {completedCount === todos.length
              ? "🎉 All tasks completed!"
              : `${todos.length - completedCount} task${todos.length - completedCount !== 1 ? "s" : ""} remaining`}
          </div>
        )}
      </div>
    </div>
  );
}