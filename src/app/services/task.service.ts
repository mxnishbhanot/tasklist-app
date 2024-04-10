import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [{
    id: 1,
    title: "Task 1",
    description: "Description 1",
    status: 'ACTIVE',
    startDate: "2024-04-11T14:35:00",
    endDate: "2024-04-14T14:40:00",
    priority: "HIGH",
    attachments: []

  }, {
    id: 2,
    title: "Task 2",
    description: "Description 2",
    status: 'COMPLETED',
    startDate: "2024-04-15T14:35:00",
    endDate: "2024-04-16T14:40:00",
    priority: "LOW",
    attachments: []
  }];
  private tasksSubject = new BehaviorSubject<Task[]>(this.tasks);
  constructor() { }

  getTasks() {
    return this.tasksSubject.asObservable();
  }

  addTask(title: string) {
    const id = this.tasks.length + 1;
    const newTask: Task = {
      id,
      title,
      status: 'ACTIVE',
      description: "",
      priority: 'LOW'
    };
    this.tasks.push(newTask);
    this.tasksSubject.next(this.tasks);
  }
}


export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  startDate?: string;
  endDate?: string;
  priority: string;
  tasklist?: string
  attachments?: []

}

