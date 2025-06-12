'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListTodo, Plus, Check, Trash2, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link'; // Added missing import

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/todos');
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to load todos');
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) {
      toast.error('Todo title cannot be empty');
      return;
    }
    
    setIsAdding(true);
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTodo }),
      });
      
      if (!response.ok) throw new Error('Failed to add todo');
      
      const addedTodo = await response.json();
      setTodos([addedTodo, ...todos]);
      setNewTodo('');
      toast.success('Todo added successfully');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to add todo');
    } finally {
      setIsAdding(false);
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    setIsToggling(id);
    try {
      const response = await fetch('/api/todos', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, completed: !completed }),
      });
      
      if (!response.ok) throw new Error('Failed to update todo');
      
      const updatedTodo = await response.json();
      setTodos(todos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
    } catch (error) {
      toast.error((error as Error).message || 'Failed to update todo');
    } finally {
      setIsToggling(null);
    }
  };

  const deleteTodo = async (id: string) => {
    setIsDeleting(id);
    try {
      const response = await fetch('/api/todos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      
      if (!response.ok) throw new Error('Failed to delete todo');
      
      setTodos(todos.filter(todo => todo.id !== id));
      toast.success('Todo deleted successfully');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to delete todo');
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-white">
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="flex items-center mb-8">
          <Link href="/" className="mr-4 p-2 rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold flex items-center">
            <ListTodo className="mr-3 text-cyan-400" size={28} />
            Todo Management
          </h1>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-lg mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              disabled={isAdding}
            />
            <button
              onClick={addTodo}
              disabled={isAdding || !newTodo.trim()}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Plus className="mr-2" size={18} />
                  Add
                </>
              )}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-dashed border-gray-700">
            <div className="text-gray-500 mb-4">No todos yet. Add one above!</div>
            <button
              onClick={() => {
                setNewTodo('Example todo');
                setTimeout(() => {
                  const addButton = document.querySelector('button[onClick="addTodo"]');
                  if (addButton) (addButton as HTMLButtonElement).click();
                }, 100);
              }}
              className="text-sm px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Create Example Todo
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {todos.map((todo) => (
                <motion.div
                  key={todo.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className={`flex items-center justify-between bg-gray-800/70 hover:bg-gray-700/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 transition-colors ${
                    todo.completed ? 'opacity-80' : ''
                  }`}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <button
                      onClick={() => toggleTodo(todo.id, todo.completed)}
                      disabled={isToggling === todo.id}
                      className={`w-6 h-6 rounded-full mr-3 flex-shrink-0 flex items-center justify-center border ${
                        todo.completed
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-500 hover:border-cyan-400'
                      } transition-colors disabled:opacity-50`}
                    >
                      {isToggling === todo.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : todo.completed ? (
                        <Check size={14} className="text-white" />
                      ) : null}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`truncate ${
                          todo.completed ? 'line-through text-gray-400' : 'text-gray-200'
                        }`}
                      >
                        {todo.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(todo.createdAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    disabled={isDeleting === todo.id}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1 disabled:opacity-50"
                  >
                    {isDeleting === todo.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}