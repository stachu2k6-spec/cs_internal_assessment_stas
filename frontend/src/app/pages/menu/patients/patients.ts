import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Button, ButtonDirective, ButtonModule } from 'primeng/button';
import { CommonModule, CurrencyPipe, DatePipe, NgForOf } from '@angular/common';
import { Tag, TagModule } from 'primeng/tag';
import { Product, ProductService } from '../../service/product.service';
import { FormsModule } from '@angular/forms';
import { DataView, DataViewModule } from 'primeng/dataview';
import { SelectButton, SelectButtonModule } from 'primeng/selectbutton';
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';
import { Toolbar } from 'primeng/toolbar';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { RouterLink } from '@angular/router';
import { PatientDto } from '@/pages/service/patient/patient.model';
import { PatientFacade } from '@/pages/service/patient/patient.facade';
import { tap } from 'rxjs';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-patients',
    standalone: true,
    imports: [CommonModule, DataViewModule, FormsModule, SelectButtonModule, PickListModule, OrderListModule, TagModule, ButtonModule, Toolbar, IconField, InputIcon, InputText, RouterLink],
    templateUrl: './patients.html',
    styleUrl: './patients.scss',
})
export class Patients implements OnInit {
    layout: 'grid' | 'list' = 'grid';

    options = ['grid', 'list'];

    /** List of patients */
    patients: PatientDto[] =[]

    constructor(
        private patientFacade: PatientFacade
    ) {}

    ngOnInit() {
        this.patientFacade.fetchAllPatients()
        this.patientFacade.patientState$
            .pipe(
                tap(x=> {
                    this.patients = x;
                })
            )
            .subscribe()

    }

    getSeverity(product: Product) {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warn';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return 'info';
        }
    }
}

