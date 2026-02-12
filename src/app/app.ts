import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { NavBar } from './shared/nav-bar/nav-bar';
import { Home } from "./features/home/home";
import { Footer } from "./shared/footer/footer";
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [NavBar, Footer, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  
  ngOnInit(): void {
    initFlowbite();
  }
}
