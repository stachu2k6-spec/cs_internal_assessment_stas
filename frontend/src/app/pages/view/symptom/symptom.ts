import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { Image } from 'primeng/image';
import { InputText } from 'primeng/inputtext';
import { Rating } from 'primeng/rating';
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
import { MeetingFacade } from '@/pages/service/meeting/meeting.facade';
import { SymptomFacade } from '@/pages/service/symptom/symptom.facade';
import { take } from 'rxjs';
import { MeetingDto } from '@/pages/service/meeting/meeting.model';
import { SymptomDto } from '@/pages/service/symptom/symptom.model';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-symptom',
    imports: [Button, InputText, Splitter, TableModule, Textarea, NgIf, ReactiveFormsModule, FormsModule, RouterLink],
    templateUrl: './symptom.html',
    styleUrl: './symptom.scss',
    providers: [ConfirmationService, MessageService, CustomerService, ProductService]
})
export class Symptom implements OnInit {
    tempData: any[] = [];

    isEditMode: boolean = false;

    // local model for editing
    symptom: SymptomDto = this.createEmptySymptom();

    private _symptomBackup: any = null;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private symptomFacade: SymptomFacade,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');

        if (!id) {
            console.warn('No symptom id found in route.');
            this.router.navigate(['/notfound']);
            return;
        }

        // clear stale symptom before loading
        this.symptom = this.createEmptySymptom();

        // subscribe to actual HTTP request
        this.symptomFacade
            .fetchById(id)
            .pipe(take(1))
            .subscribe({
                next: (dto: SymptomDto) => {
                    this.symptom = dto ? dto : this.createEmptySymptom();
                },
                error: (err: any) => {
                    console.error('Failed loading symptom', err);
                    this.router.navigate(['/notfound']);
                }
            });
    }

    enterEdit() {
        // create a shallow clone backup so cancel can restore previous state
        this._symptomBackup = { ...this.symptom };
        this.isEditMode = true;
    }

    cancelEdit() {
        if (this._symptomBackup) {
            this.symptom = { ...this._symptomBackup };
            this._symptomBackup = null;
        }
        this.isEditMode = false;
    }

    save() {
        // TODO: call your API to persist symptom changes
        // For now, we mock save with a message and toggle mode off
        this.isEditMode = false;
        this._symptomBackup = null;

        // show a toast (you already have MessageService provider)
        // this.messageService.add({
        //     severity: 'success',
        //     summary: 'Saved',
        //     detail: 'Patient data saved.'
        // });

        // If you have a real backend: call service then handle response
        // this.patientService.updatePatient(this.patient).then(...).catch(...)
    }

    private createEmptySymptom() {
        return {
            id: '-EMPTY-',
            name: '-EMPTY-',
            notes: '-EMPTY-'
        }
    }
}
