import { Component } from '@angular/core';
import { FormularioTest } from "../../shared/formulario-test/formulario-test";
import { Hero } from "../../shared/hero/hero";

@Component({
  selector: 'app-test',
  imports: [FormularioTest, Hero],
  templateUrl: './test.html',
  styleUrl: './test.css',
})
export class Test {
  
}
