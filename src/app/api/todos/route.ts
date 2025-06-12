import { NextResponse } from 'next/server';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

let todos: Todo[] = [
  { id: '1', title: 'Learn Next.js', completed: false, createdAt: new Date() },
  { id: '2', title: 'Build a Todo API', completed: true, createdAt: new Date(Date.now() - 86400000) },
  { id: '3', title: 'Integrate with AI', completed: false, createdAt: new Date(Date.now() - 172800000) },
];

export async function GET() {
  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  const { title } = await request.json();
  
  if (!title || typeof title !== 'string') {
    return NextResponse.json(
      { error: 'Title must be a valid string' },
      { status: 400 }
    );
  }

  const newTodo: Todo = {
    id: Date.now().toString(),
    title,
    completed: false,
    createdAt: new Date(),
  };

  todos.unshift(newTodo);

  return NextResponse.json(newTodo, { status: 201 });
}

export async function PATCH(request: Request) {
  const { id, completed } = await request.json();
  
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    return NextResponse.json(
      { error: 'Todo not found' },
      { status: 404 }
    );
  }

  todos[todoIndex].completed = completed;

  return NextResponse.json(todos[todoIndex]);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  
  todos = todos.filter(todo => todo.id !== id);

  return NextResponse.json(
    { success: true },
    { status: 200 }
  );
}