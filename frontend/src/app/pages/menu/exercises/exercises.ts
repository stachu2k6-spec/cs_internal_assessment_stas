import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Button, ButtonDirective } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Toolbar } from 'primeng/toolbar';
import { ProgressBar } from 'primeng/progressbar';
import { Slider } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RouterLink } from '@angular/router';
import { ExerciseDto } from '@/pages/service/exercise/exercise.model';
import { ExerciseFacade } from '@/pages/service/exercise/exercise.facade';
import { Subject, takeUntil, tap } from 'rxjs';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-exercises',
    standalone: true,
    imports: [Button, IconField, InputIcon, InputText, Toolbar, ButtonDirective, TableModule, FormsModule, RouterLink],
    templateUrl: './exercises.html',
    styleUrl: './exercises.scss',
    providers: [ConfirmationService, MessageService]
})
export class Exercises implements OnInit, OnDestroy {

    statuses: any[] = [];

    exercises: ExerciseDto[] = [];

    @ViewChild('filter') filter!: ElementRef;

    private destroy$ = new Subject<void>();

    constructor(private exerciseFacade: ExerciseFacade) {}

    ngOnInit() {
        this.exerciseFacade.fetchAllExercises();

        this.exerciseFacade.exerciseState$
            .pipe(
                tap(x => {
                    this.exercises = x;
                }),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }


    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }
}
