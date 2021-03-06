import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';

import {
    ActionBarComponent,
    ActionBarLeftComponent,
    ActionBarRightComponent,
} from './components/action-bar/action-bar.component';
import { AdjustmentOperationInputComponent } from './components/adjustment-operation-input/adjustment-operation-input.component';
import { AffixedInputComponent } from './components/affixed-input/affixed-input.component';
import { PercentageSuffixInputComponent } from './components/affixed-input/percentage-suffix-input.component';
import { ChipComponent } from './components/chip/chip.component';
import { CurrencyInputComponent } from './components/currency-input/currency-input.component';
import { CustomFieldControlComponent } from './components/custom-field-control/custom-field-control.component';
import { CustomerLabelComponent } from './components/customer-label/customer-label.component';
import { DataTableColumnComponent } from './components/data-table/data-table-column.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { FacetValueChipComponent } from './components/facet-value-chip/facet-value-chip.component';
import { FormFieldControlDirective } from './components/form-field/form-field-control.directive';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { FormItemComponent } from './components/form-item/form-item.component';
import { ItemsPerPageControlsComponent } from './components/items-per-page-controls/items-per-page-controls.component';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { DialogButtonsDirective } from './components/modal-dialog/dialog-buttons.directive';
import { DialogComponentOutletComponent } from './components/modal-dialog/dialog-component-outlet.component';
import { DialogTitleDirective } from './components/modal-dialog/dialog-title.directive';
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';
import { PaginationControlsComponent } from './components/pagination-controls/pagination-controls.component';
import { RichTextEditorComponent } from './components/rich-text-editor/rich-text-editor.component';
import { SelectToggleComponent } from './components/select-toggle/select-toggle.component';
import { TableRowActionComponent } from './components/table-row-action/table-row-action.component';
import { BackgroundColorFromDirective } from './directives/background-color-from.directive';
import { FileSizePipe } from './pipes/file-size.pipe';
import { ModalService } from './providers/modal/modal.service';

const IMPORTS = [
    ClarityModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgSelectModule,
    NgxPaginationModule,
    TranslateModule,
];

const DECLARATIONS = [
    ActionBarComponent,
    ActionBarLeftComponent,
    ActionBarRightComponent,
    AdjustmentOperationInputComponent,
    AffixedInputComponent,
    BackgroundColorFromDirective,
    ChipComponent,
    CurrencyInputComponent,
    CustomerLabelComponent,
    CustomFieldControlComponent,
    DataTableComponent,
    DataTableColumnComponent,
    ItemsPerPageControlsComponent,
    PaginationControlsComponent,
    TableRowActionComponent,
    FacetValueChipComponent,
    FileSizePipe,
    FormFieldComponent,
    FormFieldControlDirective,
    FormItemComponent,
    ModalDialogComponent,
    PercentageSuffixInputComponent,
    DialogComponentOutletComponent,
    DialogButtonsDirective,
    DialogTitleDirective,
    SelectToggleComponent,
    LanguageSelectorComponent,
    RichTextEditorComponent,
];

@NgModule({
    imports: IMPORTS,
    exports: [...IMPORTS, ...DECLARATIONS],
    declarations: DECLARATIONS,
    providers: [
        // This needs to be shared, since lazy-loaded
        // modules have their own entryComponents which
        // are unknown to the CoreModule instance of ModalService.
        // See https://github.com/angular/angular/issues/14324#issuecomment-305650763
        ModalService,
    ],
    entryComponents: [ModalDialogComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
