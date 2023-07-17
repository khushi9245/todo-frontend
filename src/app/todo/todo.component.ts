import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TodoaddComponent } from '../todoadd/todoadd.component';
import { TodoviewComponent } from '../todoview/todoview.component';
import { ViewChild, ElementRef } from '@angular/core';
import { TodoeditComponent } from '../todoedit/todoedit.component';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent {
  todos: any;
  filteredtodos: any;
  users: any;
  p: number = 1;
  @ViewChild('editModal') editModalRef!: ElementRef;


  @Output() editEvents = new EventEmitter<any>();
  Date: any;
  Task: any;
  Description: any;
  user: any;
  title: any;
  Title: any;
  startDate = '';
  endDate = '';
  selectedTodo: any;
  searchText: string = '';
  index: any;
  UserId: any;
  User: any;
  userNames: string[] = [];
  todoid: any;
  showFavoritesOnly: boolean = false;
  public dateRangeError: string = '';
  selectedUserName: any;


  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog
  ) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(this.user);
    let api_key = this.user.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${api_key}`
    });
    const requestOptions = { headers: headers };
    this.http.get('http://localhost:9090/todo', requestOptions).subscribe((data) => this.showData(data));
    //this.http.get('http://localhost:9090/todo/filter/date', requestOptions);
  }

  ngOnInit(): void {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('keyup', (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          this.searchData();
        }
      });
    }
  }

  showData(data: any) {
    console.log(data);
    this.todos = data;
    this.userNames = Array.from(new Set(this.todos.map((todo: any) => todo.tblUser.username)));
  
    // Sort the todos array based on the index in descending order
    this.todos.sort((a: any, b: any) => {
      return b.index - a.index;
    });
  
    // Assign the sorted todos array to filteredtodos
    this.filteredtodos = this.todos;
  }
  
  removeClick(todoid: string) {
    if (confirm('Are you sure you want to delete this data?')) {
      let api_key = this.user.token;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${api_key}`
      });
      const requestOptions = { headers: headers };
      console.log(todoid);
      const currentPage = this.p; // Store the current page number
      this.http.delete('http://localhost:9090/todo/' + todoid, requestOptions).subscribe((data) => {
        // Reload the todos and go back to the current page
        this.reloadTodosdelete(currentPage);
      });
    }
  }
  
  reloadTodosdelete(page: number) {
    let api_key = this.user.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${api_key}`
    });
    const requestOptions = { headers: headers };
    this.http.get('http://localhost:9090/todo', requestOptions).subscribe((data) => {
      this.showData(data);
      this.p = page; // Set the current page number
    });
  }
  

  searchData() {
    this.p = 1;
    this.filteredtodos = this.todos.filter((todo: any) => {
      const task = todo.task ? todo.task.toLowerCase() : '';
      const title = todo.title ? todo.title.toLowerCase() : '';
      const todoDate = new Date(todo.date);
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      return (
        (!this.selectedUserName || todo.tblUser.username === this.selectedUserName) &&
        (!this.showFavoritesOnly || todo.isfavourite) &&
        (!this.searchText ||
          (task.includes(this.searchText.toLowerCase()) || title.includes(this.searchText.toLowerCase()))) &&
        (!this.startDate || todoDate >= start) &&
        (!this.endDate || todoDate <= end)
      );
    });
  }

  filterByDateRange() {
    this.p = 1;
    if (this.startDate && this.endDate && this.startDate > this.endDate) {
      this.dateRangeError = 'Invalid date range.';
      alert(this.dateRangeError);
      return;
    }

    this.dateRangeError = '';
    this.searchData();
  }

  filterByUserName() {
    this.p = 1;
    this.searchData();
  }

  toggleFavorite(todo: any) {
    const todoId = todo.todoid;
    const currentPage = this.p; // Store the current page number
    todo.isfavourite = !todo.isfavourite;
    let api_key = this.user.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${api_key}`
    });
    const requestOptions = { headers: headers };
    this.http
      .put('http://localhost:9090/todo/' + todoId, { isfavourite: todo.isfavourite }, requestOptions)
      .subscribe((data) => {
        // Reload the todos and restore the current page number
        this.reloadTodos(currentPage);
      });
  }
  
  reloadTodos(page: number) {
    let api_key = this.user.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${api_key}`
    });
    const requestOptions = { headers: headers };
    this.http.get('http://localhost:9090/todo', requestOptions).subscribe((data) => {
      this.showData(data);
      this.p = page; // Restore the current page number
    });
  }
  

  toggleShowFavoritesOnly() {
    this.showFavoritesOnly = !this.showFavoritesOnly;
    this.filterByUserName();
  }

  onOpenAdd() {
    this.matDialog.open(TodoaddComponent);
  }
  todo() {
    location.reload();
  }

  onOpenView(todo: any) {
    console.log(todo);
    this.matDialog.open(TodoviewComponent, {
      data: {
        todo: todo
      }
    });
  }
  openEditModal(todo: any) {
    this.selectedTodo = todo;
    console.log(todo);
    this.matDialog.open(TodoeditComponent, {
      data: {
        todo: todo
      }
    });
}
}
