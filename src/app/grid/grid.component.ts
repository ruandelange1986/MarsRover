import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ControlsComponent } from "../controls/controls.component";
import { animate, transition, trigger, style, state, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-grid',
  imports: [NgFor, NgIf, FormsModule, ControlsComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css',
  animations: [
    trigger('moveAnimation', [
      transition('* => *', [
        query('.car', [
          stagger(500, [
            animate('400ms ease-in-out', style({ transform: 'translate(0, 0)' }))
          ])
        ])
      ])
    ])
  ]
})
export class GridComponent implements OnInit {
  @Input() sz = 0;
  @Input() moves = "";

  gridSize: number = 0;
  grid: number[][] = [];
  heading: number = 0;
  roverPosition = { x: 0, y: 0 , heading: ""};
  instructions: string[] = [];

  ngOnInit(): void {
    this.generateGrid();
  }

  generateGrid(){
    //Create the grid according to user input
    this.grid = Array(this.gridSize)
      .fill(null)
      .map(() => Array(this.gridSize).fill(0));

    //Set rover start position
    this.grid[this.roverPosition.x][this.roverPosition.y] = 0;
    
  }

  onSetHeadingClicked(newHeading: string){
    if(newHeading != ""){
      this.roverPosition.heading = newHeading;
      this.getHeadingDegrees();
    }
    else{
      alert("A valid heading needs to be entered.");
    }
  }

  setInitialPosition(newPosition: any){
      this.roverPosition.x = newPosition.newPositionX;
      this.roverPosition.y = newPosition.newPositionY;
  }

  getHeadingDegrees()
  {
    switch (this.roverPosition.heading){
      case "N":
        this.heading = 0;
        break;
      case "E":
        this.heading =  90;
        break;
      case "S":
        this.heading =  180;
        break;
      case "W":
        this.heading =  270;
        break;
    }
  }

  checkHeading(roverHeading: any){
    switch (roverHeading) {
      case 0:
          return "N";
      case -360:
          return "N";
      case 90:
          return "E";
      case -90:
          return "W";
      case 180:
          return "S";
      case -180:
          return "S";
      case 270:
          return "W";
      case -270:
          return "E";
      case 360:
          return "N";
      default:
          return "Invalid heading!";
    }
  }

  onGridSizeChangeClicked(gridSize: any) {
    //Regenerate grid after size change
    this.gridSize = gridSize;
    this.generateGrid();
  }

  onTransmitClicked(movements: string) {
    //check the string to find out what direction to rotate and move
    if(this.roverPosition.heading != ""){
      this.instructions = movements.split('');
      this.doMovements();
    }
    else{
      alert("A valid heading needs to be entered.");
    }
  }

  doMovements()
  {
    if(this.instructions.length == 0){
      alert("Simulation Completed. \n Rover position X: " + this.roverPosition.x.toString() + "\n Rover position y: " + this.roverPosition.y.toString() + "\n Heading: " + this.roverPosition.heading);
      return;
    }

    const char = this.instructions.shift();
    switch (char) {
      case "L":
        this.rotateLeft();
        break;
      case "R":
        this.rotateRight();
        break;
      case "M":
        this.move();
        break;
    }

    setTimeout(() => {
      this.doMovements();
    }, 1000);
  }

  rotateLeft(){
    if(this.heading === -360){
      this.heading = 0;
    }
    this.heading -= 90;
    this.roverPosition.heading = this.checkHeading(this.heading);
  }

  rotateRight(){
    if(this.heading === 360){
      this.heading = 0;
    }
    this.heading += 90;
    this.roverPosition.heading = this.checkHeading(this.heading);
  }

  move(){
    //move the rover in the specified direction

    switch (this.roverPosition.heading){
      case "N":
        this.moveUp();
        return;
      case "W":
        this.moveLeft();
        return;
      case "S":
        this.moveDown();
        return;
      case "E":
          this.moveRight();
          return;
    }
  }

  moveUp(){
    if(this.roverPosition.y > 0){
      this.roverPosition.y -= 1;
    }
  }

  moveRight(){
    if(this.roverPosition.x < this.gridSize-1){
        this.roverPosition.x += 1;
    }
  }

  moveDown(){
    if(this.roverPosition.y < this.gridSize-1){
      this.roverPosition.y += 1;
    }
  }

  moveLeft(){
    if(this.roverPosition.x > 0){
      this.roverPosition.x -= 1;
    }
  }

}
