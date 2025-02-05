import { Component, Output, EventEmitter } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-controls',
  imports: [NgIf],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.css'
})
export class ControlsComponent {
  @Output() changeGridSizeEvent = new EventEmitter<number>();
  @Output() doMovements = new EventEmitter<string>();
  @Output() setHeading = new EventEmitter<string>();
  @Output() setRoverPosition = new EventEmitter<any>();

  showSettings = false;
  gridSize = 0;

  validateInput(event: KeyboardEvent, type: boolean): void {
    //Limit input to L R M characters 
    var allowedChars = ['L', 'R', 'M'];
    if(type){
      var allowedChars = ['N', 'W', 'S', 'E'];
    }

    const inputValue = event.target as HTMLInputElement;
    inputValue.value = inputValue.value.split('').filter(char => allowedChars.includes(char)).join('');
  }

  validatePosition(event: KeyboardEvent): void {
    const inputValue = event.target as HTMLInputElement;

    if(inputValue.valueAsNumber > this.gridSize){
      setTimeout(() => {
        window.alert('Cannot enter position greater than size of the grid');
        }, 500);
    }
  }


  onGenerateGridClicked(newSize:number) {
    //check if grid size is entered
    if(newSize >= 2 && newSize <= 40){
      this.gridSize = newSize;
      this.changeGridSizeEvent.emit(newSize)
      this.showSettings = true;
    }
    else{
      setTimeout(() => {
        window.alert('Please ensure a grid size between 2 - 40 is entered');
        }, 500);
    }
  }

  onSetPositionClicked(newPositionX: number, newPositionY: number){
    //check if position is within generated grid bounds
    if(newPositionX <= this.gridSize || newPositionY <= this.gridSize){
      this.setRoverPosition.emit({newPositionX, newPositionY});
    }
    else{
      setTimeout(() => {
        window.alert('Cannot enter position greater than size of the grid');
        }, 500);
    }

    
  }

  onSetHeadingClicked(newHeading:string){
    this.setHeading.emit(newHeading);
  }

  onTransmitClicked(movements: string) {
      this.doMovements.emit(movements);
  }
}