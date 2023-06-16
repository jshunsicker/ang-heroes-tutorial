import { Component, OnInit } from '@angular/core';
import { IHero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit {
  heroes: IHero[] = [];
  selectedHero?: IHero;

  constructor(private heroService: HeroService) {}

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe((x) => (this.heroes = x));
  }

  add(name: string): void {
    name = name.trim();
    if(!name) { return ; }
    const hero = {name} as IHero;
    this.heroService.addHero(hero).subscribe(hero => this.heroes.push(hero));
  }

  delete(hero: IHero): void {
    this.heroes = this.heroes.filter(h => h!==hero);
    this.heroService.deleteHero(hero.id).subscribe();
  }
}
