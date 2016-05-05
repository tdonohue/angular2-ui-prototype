import { Component } from 'angular2/core';
import { Router } from 'angular2/router';

import {
    FORM_DIRECTIVES,
    FORM_BINDINGS,
    ControlGroup,
    Control,
    FormBuilder,
    NgForm,
    Validators
} from 'angular2/common';

import { TranslateService, TranslatePipe } from "ng2-translate/ng2-translate";

import { AuthorizationService } from '../authorization/services/authorization.service';
import { ContextProviderService } from '../services/context-provider.service';
import { DSpaceService } from '../services/dspace.service';
import { DSpaceDirectory } from '../dspace.directory';
import { FormService } from '../../utilities/services/form.service';

import { FormFieldsetComponent } from '../../utilities/components/form-fieldset.component';

import { Community } from "../models/community.model";
import { FormInput } from '../../utilities/models/form-input.model';

/**
 * 
 */
@Component({
    selector: 'community-create',
    pipes: [TranslatePipe],
    directives: [FormFieldsetComponent],
    template: ` 
                <form *ngIf="active" [ngFormModel]="form" (ngSubmit)="createCommunity()" novalidate>
                    
                    <form-fieldset [form]="form" [inputs]="inputs"></form-fieldset>

                    <div class="pull-right">
                        <button type="button" class="btn btn-default btn-sm" (click)="reset()">Reset</button>
                        <button type="submit" class="btn btn-primary btn-sm" [disabled]="!form.valid">Submit</button>
                    </div>

                </form>
              `
})
export class CommunityCreateComponent {

    /**
     * Used to remove and add the form to reset validations. Suggested by Angular2 form examples.
     */
    private active: boolean = false;

    /**
     * Item input fields.
     */
    private inputs: Array<FormInput>;

    /**
     * The forms control group.
     */
    private form: ControlGroup;

    /**
     * Indicates item creation in progress.
     */
    private creating: boolean = false;

    /**
     * Community being created. ngModel
     */
    private community: Community;

    /**
     *
     * @param authorization
     *      AuthorizationService is a singleton service to interact with the authorization service.
     * @param contextProvider
     *      ContextProviderService is a singleton service in which provides current context.
     * @param dspaceService
     *      DSpaceService is a singleton service to interact with the dspace service.
     * @param formService
     *      FormService is a singleton service to retrieve form data.
     * @param dspace
     *      DSpaceDirectory is a singleton service to interact with the dspace directory.
     * @param translate
     *      TranslateService
     * @param builder
     *      FormBuilder is a singleton service provided by Angular2.
     * @param router
     *      Router is a singleton service provided by Angular2.
     */
    constructor(private authorization: AuthorizationService,
                private contextProvider: ContextProviderService,
                private dspaceService: DSpaceService,
                private formService: FormService,
                private dspace: DSpaceDirectory,
                private translate: TranslateService,
                private builder: FormBuilder,
                private router: Router) {
        translate.setDefaultLang('en');
        translate.use('en');
        this.init();
    }

    /**
     * Initialize the form and validators.
     */
    private init(): void {
        this.community = new Community();
        this.formService.getForm('community').subscribe(inputs => {
            this.inputs = inputs;
            let formControls = {};
            for(let input of this.inputs) {
                input.value = input.default ? input.default : '';
                let validators = this.createValidators(input);
                formControls[input.id] = new Control('', Validators.compose(validators));
            }
            this.form = this.builder.group(formControls);
            this.active = true;
        },
        errors => {
            console.log(errors);
        });
    }

    /**
     * 
     */
    private createValidators(input: FormInput): Array<any> {
        let validators: Array<any> = new Array<any>();
        for(let key in input.validation) {
            if(key == 'required') {
                if(input.validation[key]) {
                    validators.push(Validators.required);
                }
            }
            else {
                validators.push(Validators[key](input.validation[key]));
            }
        }
        return validators;
    }

    /**
     * Create community.
     */
    private createCommunity(): void {
        this.creating = true;
        let token = this.authorization.user.token;
        let currentContext = this.contextProvider.context;

        this.setModelValues();  

        this.dspaceService.createCommunity(this.community, token, currentContext.id).subscribe(response => {
            if(response.status == 200) {
                this.reset();
                if(currentContext.root) {
                    this.dspace.refresh();
                    this.router.navigate(['/Dashboard']);
                }
                else {
                    this.dspace.refresh(currentContext);
                    this.router.navigate(['/Communities', { id: currentContext.id }]);
                }
            }
        },
        error => {
            this.reset();
            console.log(error);
        });
    }

     /**
     *
     */
    private setModelValues(): void {
        for(let input of this.inputs) {
            if(input.value) {
                this.community[input.key] = input.value;
            }
        }
    }

    /**
     * Reset form.
     */
    private reset(): void {
        this.creating = false;
        this.active = false;
        this.init();
    }

}
