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
        private router: Router
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

    save() {
        // TODO: call your API to persist exercise changes
        // For now, we mock save with a message and toggle mode off
        this.isEditMode = false;
        this._exerciseBackup = null;

        // show a toast (you already have MessageService provider)
        // this.messageService.add({
        //     severity: 'success',
        //     summary: 'Saved',
        //     detail: 'Patient data saved.'
        // });

        // If you have a real backend: call service then handle response
        // this.patientService.updatePatient(this.patient).then(...).catch(...)
    }

    private createEmptyExercise() {
        return {
            id: '-EMPTY-',
            name: '-EMPTY-',
            notes: '-EMPTY-'
        }
    }
}
