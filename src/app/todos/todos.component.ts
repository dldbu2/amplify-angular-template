import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { FormsModule, NgModel } from '@angular/forms';

const client = generateClient<Schema>();

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})
export class TodosComponent implements OnInit {
  todos: any[] = [];
  newTodo: string = '';

  ngOnInit(): void {
    this.listTodos();
  }

  listTodos() {
    try {
      client.models.Todo.observeQuery().subscribe({
        next: ({ items, isSynced }) => {
          this.todos = items;
        },
      });
    } catch (error) {
      console.error('error fetching todos', error);
    }
  }

  createTodo() {
    try {
      if (this.newTodo === '') return;
      client.models.Todo.create({
        content: this.newTodo,
      });
      this.listTodos();
    } catch (error) {
      console.error('error creating todos', error);
    }
  }
  
  deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }  
}
