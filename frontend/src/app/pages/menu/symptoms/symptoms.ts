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
import { SymptomDto } from '@/pages/service/symptom/symptom.model';
import { SymptomFacade } from '@/pages/service/symptom/symptom.facade';
import { Subject, takeUntil, tap } from 'rxjs';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-symptoms',
    standalone: true,
    imports: [
        Button, IconField, InputIcon, InputText, Toolbar, ButtonDirective,
        ProgressBar, Slider, TableModule, FormsModule, RouterLink
    ],
    templateUrl: './symptoms.html',
    styleUrl: './symptoms.scss',
    providers: [ConfirmationService, MessageService]
})
export class Symptoms implements OnInit, OnDestroy {

    statuses: any[] = [];
    activityValues: number[] = [0, 100];
    symptoms: SymptomDto[] = [];

    @ViewChild('filter') filter!: ElementRef;

    private destroy$ = new Subject<void>();

    constructor(private symptomFacade: SymptomFacade) {}

    ngOnInit() {
        this.symptomFacade.fetchAllSymptoms();

        this.symptomFacade.symptomState$
            .pipe(
                tap(x => {
                    this.symptoms = x;
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
