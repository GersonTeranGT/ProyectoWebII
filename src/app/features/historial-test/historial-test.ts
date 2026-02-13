import { Component } from '@angular/core';
import { TablaTest } from "../../shared/tabla-test/tabla-test";
import { Hero } from "../../shared/hero/hero";

@Component({
  selector: 'app-historial-test',
  imports: [TablaTest, Hero],
  templateUrl: './historial-test.html',
  styleUrl: './historial-test.css',
})
export class HistorialTest {

}
