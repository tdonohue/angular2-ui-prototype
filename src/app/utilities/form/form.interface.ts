import { ControlGroup } from '@angular/common';

import { FormInput } from './form-input.model';

/**
 *
 */
export interface Form {

    /**
     * Used to remove and add the form to reset validations. Suggested by Angular2 form examples.
     */
    active: boolean;

    /**
     * Item input fields.
     */
    inputs: Array<FormInput>;

    /**
     * The forms control group.
     */
    form: ControlGroup;

    /**
     * Indicates processing in progress.
     */
    processing: boolean;
    
    /**
     *
     */
    init(): void;

    /**
     *
     */
    setModelValues(): void;

    /**
     *
     */
    reset(): void;
    
    /**
     *
     */
    disabled(): boolean;

    /**
     *
     */
    showForm(): boolean;

    /**
     *
     */
    processingMessage(): string;

    /**
     *
     */
    finish(name: string, currentContext: any): void;

}