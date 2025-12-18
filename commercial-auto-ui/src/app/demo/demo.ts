import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

interface City {
  id: number;
  name: string;
  avatar?: string;
}

interface Person {
  id: string;
  name: string;
  age: number;
  country: string;
}

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './demo.html',
  styleUrl: './demo.scss'
})
export class Demo implements OnInit {
  // Basic select
  selectedCity: any;
  cities: City[] = [
    { id: 1, name: 'Vilnius' },
    { id: 2, name: 'Kaunas' },
    { id: 3, name: 'Pavilnys' },
    { id: 4, name: 'Pabradė' },
    { id: 5, name: 'Klaipėda' }
  ];

  // Multi-select
  selectedCities: City[] = [];

  // Searchable select
  selectedPerson: Person | undefined;
  people: Person[] = [
    { id: '1', name: 'John Doe', age: 30, country: 'USA' },
    { id: '2', name: 'Jane Smith', age: 25, country: 'UK' },
    { id: '3', name: 'Bob Johnson', age: 35, country: 'Canada' },
    { id: '4', name: 'Alice Williams', age: 28, country: 'Australia' },
    { id: '5', name: 'Charlie Brown', age: 32, country: 'Germany' },
    { id: '6', name: 'Diana Prince', age: 29, country: 'France' },
    { id: '7', name: 'Edward Norton', age: 40, country: 'Italy' },
    { id: '8', name: 'Fiona Green', age: 27, country: 'Spain' }
  ];

  // Custom template
  selectedCountry: any;
  countries = [
    { id: 1, name: 'United States', code: 'US', flag: '🇺🇸' },
    { id: 2, name: 'United Kingdom', code: 'UK', flag: '🇬🇧' },
    { id: 3, name: 'Canada', code: 'CA', flag: '🇨🇦' },
    { id: 4, name: 'Australia', code: 'AU', flag: '🇦🇺' },
    { id: 5, name: 'Germany', code: 'DE', flag: '🇩🇪' },
    { id: 6, name: 'France', code: 'FR', flag: '🇫🇷' },
    { id: 7, name: 'Italy', code: 'IT', flag: '🇮🇹' },
    { id: 8, name: 'Spain', code: 'ES', flag: '🇪🇸' }
  ];

  // Grouped select
  selectedAlbum: any;
  albums = [
    {
      group: 'Rock',
      items: [
        { id: 1, name: 'Dark Side of the Moon' },
        { id: 2, name: 'Led Zeppelin IV' },
        { id: 3, name: 'Abbey Road' }
      ]
    },
    {
      group: 'Pop',
      items: [
        { id: 4, name: 'Thriller' },
        { id: 5, name: '21' },
        { id: 6, name: '1989' }
      ]
    },
    {
      group: 'Hip Hop',
      items: [
        { id: 7, name: 'The Marshall Mathers LP' },
        { id: 8, name: 'To Pimp a Butterfly' },
        { id: 9, name: 'Illmatic' }
      ]
    }
  ];

  // Custom add tag
  selectedTags: string[] = [];
  availableTags = ['Angular', 'React', 'Vue', 'Svelte', 'TypeScript', 'JavaScript'];

  // Disabled state
  selectedDisabled: any;
  isDisabled = false;

  ngOnInit(): void {
    // Pre-select some values
    this.selectedCity = this.cities[0];
    this.selectedCities = [this.cities[0], this.cities[2]];
    this.selectedCountry = this.countries[0];
  }

  addCustomTag = (term: string) => {
    return { id: term, name: term };
  }

  toggleDisabled() {
    this.isDisabled = !this.isDisabled;
  }

  clearSelection(type: string) {
    switch(type) {
      case 'basic':
        this.selectedCity = null;
        break;
      case 'multi':
        this.selectedCities = [];
        break;
      case 'search':
        this.selectedPerson = undefined;
        break;
      case 'country':
        this.selectedCountry = null;
        break;
      case 'album':
        this.selectedAlbum = null;
        break;
      case 'tags':
        this.selectedTags = [];
        break;
    }
  }
}
