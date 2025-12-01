import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { Splitter } from 'primeng/splitter';
import { Table, TableModule } from 'primeng/table';
import { Textarea } from 'primeng/textarea';
import { Customer, CustomerService, Representative } from '@/pages/service/customer.service';
import { Product, ProductService } from '@/pages/service/product.service';
import { ObjectUtils } from 'primeng/utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { SymptomDto } from '@/pages/service/symptom/symptom.model';
import { SymptomFacade } from '@/pages/service/symptom/symptom.facade';
import { ExerciseDto } from '@/pages/service/exercise/exercise.model';
import { ExerciseFacade } from '@/pages/service/exercise/exercise.facade';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-exercise',
    imports: [Button, InputText, Splitter, TableModule, Textarea, NgIf, ReactiveFormsModule, FormsModule, RouterLink],
    templateUrl: './exercise.html',
    styleUrl: './exercise.scss',
    providers: [ConfirmationService, MessageService, CustomerService, ProductService]
})
export class Exercise implements OnInit {

    customers2: Customer[] = [];

    isEditMode: boolean = false;

    // local model for editing
    exercise: ExerciseDto = this.createEmptyExercise();

    private _exerciseBackup: any = null;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private exerciseFacade: ExerciseFacade,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');

        if (!id) {
            console.warn('No exercise id found in route.');
            this.router.navigate(['/notfound']);
            return;
        }

        // clear stale exercise before loading
        this.exercise = this.createEmptyExercise();

        // subscribe to actual HTTP request
        this.exerciseFacade
            .fetchById(id)
            .pipe(take(1))
            .subscribe({
                next: (dto: ExerciseDto) => {
                    this.exercise = dto ? dto : this.createEmptyExercise();
                },
                error: (err: any) => {
                    console.error('Failed loading exercise', err);
                    this.messageService.add({ severity: 'error', summary: 'Load failed', detail: 'Exercise could not be loaded.' });
                    this.router.navigate(['/notfound']);
                }
            });
    }

    enterEdit() {
        // create a shallow clone backup so cancel can restore previous state
        this._exerciseBackup = { ...this.exercise };
        this.isEditMode = true;
    }

    cancelEdit() {
        if (this._exerciseBackup) {
            this.exercise = { ...this._exerciseBackup };
            this._exerciseBackup = null;
        }
        this.isEditMode = false;
    }

    /**
     * Save changes to the exercise.
     * Calls exerciseFacade.updateExercise(id) which you said only accepts an id: string.
     * Handles several possible return types:
     *  - Observable<ExerciseDto> (updates local model)
     *  - Observable<any> (assumes success)
     *  - if updateExercise missing -> fallback to local-only save
     */
    save() {
        // basic validation
        if (!this.exercise) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No exercise loaded.' });
            return;
        }

        if (!this.exercise.name || !this.exercise.name.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Exercise name is required.' });
            return;
        }

        // optimistic UI: exit edit mode while saving
        const prevEditState = this.isEditMode;
        this.isEditMode = false;


        this.exerciseFacade.updateExercise(this.exercise.id, this.exercise).pipe(take(1)).subscribe({
            next: (saved: SymptomDto) => {
                this.exercise = saved ? saved : this.exercise;
                this._exerciseBackup = null;
                this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Symptom saved successfully.' });
            },
            error: (err: any) => {
                console.error('Failed to save exercise', err);
                this.isEditMode = prevEditState;
                this.messageService.add({ severity: 'error', summary: 'Save failed', detail: err?.message ?? 'Unknown error' });
            }
        });


    }

    private createEmptyExercise(): ExerciseDto {
        return {
            id: '',
            name: '',
            notes: ''
        } as ExerciseDto;
    }
}
