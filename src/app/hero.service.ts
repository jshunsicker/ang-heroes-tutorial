import { Injectable } from '@angular/core';
import { IHero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  private heroesUrl = 'api/heroes';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getHeroes(): Observable<IHero[]> {
    return this.http.get<IHero[]>(this.heroesUrl).pipe(
      tap((heroes) => {
        this.log('fetchedHeroes');
        console.log('heroes:', heroes);
      }),
      catchError(this.handleError<IHero[]>('getHeroes', []))
    );
  }

  getHero(id: number): Observable<IHero | undefined> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<IHero>(url).pipe(
      tap((_) => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<IHero>(`getHero id=${id}`))
    );
  }

  updateHero(hero: IHero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((_) => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addHero(hero: IHero): Observable<IHero> {
    return this.http
      .post<IHero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(tap((newHero) => this.log(`created hero with id = ${newHero.id}`)),
        catchError(this.handleError<any>(`addHero name=${hero.name}`))
      );
  }

  deleteHero(id: number): Observable<IHero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<any>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted hero with id=${id}`)),
      catchError(this.handleError<IHero>(`deleteHero id=${id}`))
    );
  }

  searchHeroes(term: string): Observable<IHero[]> {
    if(!term.trim()) {
      return of([]);
    }
    return this.http.get<IHero[]>(`${this.heroesUrl}/?name=${term}`)
    .pipe(
      tap(x => x.length ? this.log(`found heroes matching term "${term}"`) 
       : this.log(`no heroes matching"${term}" `)),
       catchError(this.handleError<IHero[]>('searchHeroes', []))
    )
  }

  private log(message: string) {
    this.messageService.add(`Hero Service: ${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
