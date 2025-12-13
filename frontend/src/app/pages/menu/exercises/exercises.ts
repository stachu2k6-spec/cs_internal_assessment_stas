import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Button, ButtonDirective } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Toolbar } from 'primeng/toolbar';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MultiSelect } from 'primeng/multiselect';
import { ProgressBar } from 'primeng/progressbar';
import { Select } from 'primeng/select';
import { Slider } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Customer, CustomerService, Representative } from '../../service/customer.service';
import { Product, ProductService } from '../../service/product.service';
import { ObjectUtils } from 'primeng/utils';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RouterLink } from '@angular/router';
import { MeetingDto } from '@/pages/service/meeting/meeting.model';
import { ExerciseDto } from '@/pages/service/exercise/exercise.model';
import { MeetingFacade } from '@/pages/service/meeting/meeting.facade';
import { ExerciseFacade } from '@/pages/service/exercise/exercise.facade';
import { Subject, takeUntil, tap } from 'rxjs';
import { Subscription } from 'rxjs';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-exercises',
    standalone: true,
    imports: [Button, IconField, InputIcon, InputText, Toolbar, ButtonDirective, ProgressBar, Slider, TableModule, FormsModule, RouterLink],
    templateUrl: './exercises.html',
    styleUrl: './exercises.scss',
    providers: [ConfirmationService, MessageService, CustomerService, ProductService]
})
export class Exercises implements OnInit, OnDestroy {

    statuses: any[] = [];

    activityValues: number[] = [0, 100];

    exercises: ExerciseDto[] = [];

    @ViewChild('filter') filter!: ElementRef;

    private exerciseSub!: Subscription;

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
